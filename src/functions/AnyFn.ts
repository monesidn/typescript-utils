/**
 * Defines a generic function. Use this in place of Function.
 */
type AnyFn<T extends any[] = any[], R = any> = (...args: T) => R;
export default AnyFn;
