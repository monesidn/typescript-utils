/**
 * Defines a simple function in the mathematical meaning.
 */
export type Fn<T, R> = (arg: T) => R;

/**
 * Defines a generic function. Use this in place of Function.
 */
export type AnyFn<T extends any[] = any[], R = any> = (...args: T) => R;

/**
 * Defines a callable function that doesn't return a value.
 */
export type VoidFn<T> = (arg: T) => void;

/**
 * Defines a callable function that doesn't return a value.
 */
export type GeneratorFn<T> = () => T;

/**
 * Defines a callable function that doesn't return or take a value.
 */
export type EmptyFn = () => void;

/**
 * Type guard checking that the given obj is a function.
 * @param obj
 * @returns
 */
export const isFunction = (obj: any): obj is AnyFn => typeof obj === "function";

/**
 * Generic noop function.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
