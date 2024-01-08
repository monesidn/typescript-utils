import defer, { DeferObj } from "./defer";
import delay from "./delay";

export interface AsyncDebounceOptions {
    /**
     * If given apply a debounce to the wrapped function so it's not called
     * immediately.
     */
    preCallDebounce?: number;
}

/**
 * When working with UIs it's common to have a situation when an async function is invoked
 * in response to an UI event. In this scenarion race conditions between calls may occur.
 * The easiest way to resolve these conditions is to ignore/abort any result that is not generated
 * by the latests invocation of the async function.
 *
 * This utility takes an async function and ensure that the caller will always receive the result
 * obtained by the latest call to the function ignoring any intermediate result.
 *
 * Keep in mind that in most situations a debounce is not enough to replace this utility. The debounce
 * can only delay the execution and prevent results **before** the function execution while this wrapper
 * also handles the time frame to execute the async operation.
 *
 * This utility also provides to the decorated function an AbortController instance that should be used
 * to cancel intermediate pending calls if possible.
 *
 * @example
 * Suppose you have a search function like the following that, based on the number or results,
 * may take 1 second or 10 ms to execute:
 * ```typescript
 * const search = (signal: AbortController, criteria: string) => fetch(`/api/search?q=${criteria}`, { signal });
 * ```
 * If the user type in "he" it takes one second to resolve. But the user keeps writing so
 * he enters "hello world" before the initial search for "he" is complete.
 *
 * The search for "hello world" takes only 10 ms (as it's far more specific) so you receive the
 * result immediatly and, in your react component, do `setResults(results)`.
 *
 * But what happens now when the result for "he" finally arrives? The search that started earlier
 * is resolving latest and you end up doing `setResults(results)` again, only this time the results are
 * from an earlier query.
 *
 * @param fn The function to wrap. Each call to the wrapper will result in a call to this function.
 * @returns
 */
const asyncDebounce = <Args extends any[], T>(
    fn: (...args: [AbortSignal, ...Args]) => Promise<T>,
    options: AsyncDebounceOptions = {}
) => {
    let output: DeferObj<T> | undefined;
    let abortPrev: AbortController | undefined;

    /**
     * Once a promise settle we need to reset the status of the asyncDebounce
     * so the next call spawns a new chain
     */
    const reset = () => {
        output = undefined;
        abortPrev = undefined;
    };

    return (...args: Args) => {
        if (abortPrev) {
            // We cancel any pending previous execution.
            abortPrev.abort();
        }

        if (!output) {
            output = defer<T>();
        }

        const abort = new AbortController();
        abortPrev = abort;

        (async () => {
            if (options?.preCallDebounce && options.preCallDebounce > 0) {
                await delay(options.preCallDebounce);
            }

            if (abort.signal.aborted) {
                return;
            }

            fn(abort.signal, ...args).then(
                (result) => {
                    if (output && !abort.signal.aborted) {
                        output.resolve(result);
                        reset();
                    }
                },
                (error) => {
                    if (output && !abort.signal.aborted) {
                        output.reject(error);
                        reset();
                    }
                }
            );
        })();
        return output.promise;
    };
};

export default asyncDebounce;
