import AnyFn from "./AnyFn";

/**
 * Type guard checking that the given obj is a function.
 * @param obj
 * @returns
 */
const isFunction = (obj: any): obj is AnyFn => typeof obj === "function";
export default isFunction;
