import isPromise from "../../src/misc/isPromise";
import toPromise from "../../src/misc/toPromise";

describe("toPromise() - utility", () => {
    test("Doesn't wrap a promise", () => {
        const p = Promise.resolve();
        expect(toPromise(p) === p).toBe(true);
    });

    test("Works with non-esiting method", () => {
        const item = {};
        expect(isPromise(toPromise(item))).toBe(true);
    });
});
