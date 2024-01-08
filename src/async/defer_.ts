/**
 * Interface of a Defer Object.
 */
export interface DeferObj<T> {
    /**
     * Underlying promise. This is what you probably what to pass around.
     */
    promise: Promise<T>;

    /**
     * The resolve function. This is exactly the resolve function that is passed to
     * the promise constructor callback.
     */
    resolve: (result: T) => void;

    /**
     * The reject function. This is exactly the reject function that is passed to
     * the promise constructor callback.
     */
    reject: (error: Error) => void;
}

/**
 * Sometimes it may be useful to have a promise that we can
 * resolve from the outside. While this is not a pattern I'd encourage it can
 * be useful in a few situations.
 * This class is inspired by the angularjs $q Defer objects
 * @example
 * ```typescript
 * export async function deferExample() {
 *     const d = defer<boolean>();
 *     mockLoadPerson2().then((p) => d.resolve(p));
 *     return d.promise;
 * }
 * ```
 */
const defer = <T>(): DeferObj<T> => {
    let resolve: (result: T) => void;
    let reject: (error: Error) => void;

    const promise = new Promise<T>((resolveFn, rejectFn) => {
        reject = rejectFn;
        resolve = resolveFn;
    });

    return {
        promise,
        resolve: resolve!,
        reject: reject!
    };
};

export default defer;
