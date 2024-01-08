import isPromise from "./isPromise";

/**
 * Check if the given object is a promise. If so returns it otherwise wraps it into a resolved
 * Promise.
 * @param obj - The object to return or wrap.
 * @returns
 */
const toPromise = <T>(obj: T | Promise<T>): Promise<any> => {
    if (isPromise(obj)) {
        return obj;
    }
    return Promise.resolve(obj);
};
export default toPromise;
