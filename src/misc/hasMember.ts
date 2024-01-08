import Fn from "../functions/Fn";

/**
 * Check that `target` object has a member named `name`. If the member
 * is available calls the extraCheck function passing the member value.
 * @param target - The object to inspect.
 * @param name - The name of the property to inspect.
 * @param extraCheck - A callback invoked if the member is available on the object. It will receive the value
 * as first argument.
 * @returns `true` if the member exists.
 */
const hasMember = (obj: any, name: string, extraCheck?: Fn<any, boolean>) => {
    if (name in obj) return extraCheck ? extraCheck(obj[name]) : true;
    return false;
};
export default hasMember;
