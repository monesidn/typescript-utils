import hasMember from "../../src/misc/hasMember";

describe("hasMember() - utility", () => {
    test("Works with existing ownProperties", () => {
        const item = { foo: "bar" };

        expect(hasMember(item, "foo")).toBe(true);
    });

    test("Works with non-existing property", () => {
        const item = { foo: "bar" };

        expect(hasMember(item, "foo2")).toBe(false);
    });

    test("Works with properties from prototype ", () => {
        const item = { foo: "bar" };
        const item2 = {};
        (item2 as any).__proto__ = item;

        expect(hasMember(item2, "foo")).toBe(true);
    });

    test("Works with properties having undefined as value", () => {
        const item = { foo: undefined };

        expect(hasMember(item, "foo")).toBe(true);
    });
});
