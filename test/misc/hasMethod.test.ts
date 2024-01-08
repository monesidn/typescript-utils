import hasMember from "../../src/misc/hasMember";
import hasMethod from "../../src/misc/hasMethod";

describe("hasMethod() - utility", () => {
    test("Works with own methods", () => {
        const item = { foo() {} };

        expect(hasMethod(item, "foo")).toBe(true);
    });

    test("Works with non-esiting method", () => {
        const item = { foo() {} };

        expect(hasMethod(item, "foo2")).toBe(false);
    });

    test("Works with methods from prototype ", () => {
        const item = { foo() {} };
        const item2 = {};
        (item2 as any).__proto__ = item;

        expect(hasMember(item2, "foo")).toBe(true);
    });

    test("Works with es6 class", () => {
        class TestClass {
            foo() {}
        }

        expect(hasMember(new TestClass(), "foo")).toBe(true);
    });

    test("Works with es6 class hierarchy", () => {
        class TestClass {
            foo() {}
        }

        class TestClass2 extends TestClass {}

        expect(hasMember(new TestClass2(), "foo")).toBe(true);
    });
});
