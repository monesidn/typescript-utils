import isPromise from "../../src/misc/isPromise";

describe("isPromise() - utility", () => {
    test("Positive test", () => {
        const p = Promise.resolve();
        expect(isPromise(p)).toBe(true);
    });

    test("Negative test", () => {
        const item = {};
        expect(isPromise(item)).toBe(false);
    });
});
