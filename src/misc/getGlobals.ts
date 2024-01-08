/**
 * Safe way to retrieve the global object which depends on environment.
 * @returns
 */
const getGlobals = () => {
    if (typeof window !== "undefined") {
        // We are in a browser so the global object is window
        return window;
    } else {
        // We are in a nodejs env. Global object is global
        return global;
    }
};

export default getGlobals;
