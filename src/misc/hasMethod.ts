import isFunction from "../functions/isFunction";
import hasMember from "./hasMember";

/**
 * Check that `target` object has a method (a function member) named `name`
 * @param obj -
 * @param name -
 * @returns `true` if the method exists.
 */
export const hasMethod = (obj: any, name: string) => {
    return hasMember(obj, name, isFunction);
};
export default hasMethod;
