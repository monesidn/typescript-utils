/**
 * Sometimes it may be useful to have a promise that we can
 * resolve from the outside. While this is not a pattern I'd encourage it can
 * be useful in a few situations.
 * This class is inspired by the angularjs $q Defer objects
 * @example
 * ```typescript
 * export async function deferExample() {
 *     const defer = new Defer<Person>();
 *     mockLoadPerson2().then((p) => defer.resolve(p));
 *     return defer.promise;
 * }
 * ```
 */
export class Defer<T> {
    /**
     * Underlying promise. This is what you probably what to pass around.
     */
    promise: Promise<T>;

    /**
     * The resolve function. This is exactly the resolve function that is passed to
     * the promise constructor callback.
     */
    resolve!: (result: T) => void;

    /**
     * The reject function. This is exactly the reject function that is passed to
     * the promise constructor callback.
     */
    reject!: (error: Error) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
}
