/**
 * A simple utility returning a promise that is resolved after the specified
 * time. Optionally you can also provide a value to return.
 * @param delay How long for the promise to resolve. If not provided defaults to 0 so execution
 * is delayed to next tick (like with setTimeout(..., 0))
 * @param value Optional value to resolve the promise with. If not given `undefined` is used.
 * @returns A promise.
 * @example
 * Using only the first argument.
 * ```typescript
 * async function mockLoadPerson1(): Promise<Person> {
 *     await delay(100); // We simulate an async response
 *     return {
 *         name: "John",
 *         surname: "Doe",
 *         email: "jdoe@mailinator.com",
 *         username: "john"
 *     };
 * }
 * ```
 *
 * Using both the first arguments.
 * ```typescript
 * async function mockLoadPerson2(): Promise<Person> {
 *     return delay(100, {
 *         name: "John",
 *         surname: "Doe",
 *         email: "jdoe@mailinator.com",
 *         username: "john"
 *     });
 * }
 * ```
 */
export const delay = <T = undefined>(delay?: number, value?: T): Promise<T> => {
    // I had to use `as any` otherwise typescript won't allow me to make `value` optional.
    return new Promise<T>((resolve) => setTimeout(() => resolve(value as any), delay));
};
