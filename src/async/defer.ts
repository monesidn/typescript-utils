/**
 * $q inspired Defer object that can be useful in some situations
 */
export class Defer<T> {
    promise: Promise<T>;
    resolve!: (result: T) => void;
    reject!: (error: Error) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject;
            this.resolve = resolve;
        });
    }
};
