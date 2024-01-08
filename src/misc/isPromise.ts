import hasMethod from "./hasMethod";

/**
 * Type guard to check whatever the given object is a Promise object.
 * This method checks if the object expose the `then`, `catch`, and `finally` methods.
 * @param obj - The object to check.
 * @returns
 */
const isPromise = (obj: any): obj is Promise<any> => {
    return hasMethod(obj, "then") && hasMethod(obj, "catch") && hasMethod(obj, "finally");
};
export default isPromise;
