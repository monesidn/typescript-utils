import LoggerManager from "../../src/logger/LoggerManager";
import LogLevel from "../../src/logger/LogLevel";
import asyncDebounce from "../../src/async/asyncDebounce";
import delay from "../../src/async/delay";

LoggerManager.setDefaultLevel(LogLevel.WARN);
LoggerManager.updateLoggers();

describe("Check AsyncDebounce works", () => {
    test("single call", async () => {
        const searchApi = asyncDebounce(async (abort, query: string) => await delay(50 - query.length, query));

        const q = "Hello";
        await expect(searchApi(q)).resolves.toBe(q);
    });

    test("3 calls canceling each other", async () => {
        const impl = jest.fn(async (abort, query: string) => await delay(50 - query.length, query));
        const searchApi = asyncDebounce(impl);

        const q1 = "Hello",
            q2 = "Hello W",
            q3 = "Hello World";
        const p1 = searchApi(q1);
        const p2 = searchApi(q2);
        const p3 = searchApi(q3); // This is the first one to resolve so it must not be overridden by the others

        expect(p1 === p2).toBeTruthy();
        expect(p2 === p3).toBeTruthy();

        await expect(p3).resolves.toBe(q3);
        expect(impl.mock.calls.length).toBe(3);
    });

    test("3 calls and with debounce", async () => {
        const impl = jest.fn(async (abort, query: string) => await delay(50 - query.length, query));
        const searchApi = asyncDebounce(impl, { preCallDebounce: 10 });

        const q1 = "Hello",
            q2 = "Hello W",
            q3 = "Hello World";

        const p1 = searchApi(q1);
        const p2 = searchApi(q2);
        const p3 = searchApi(q3); // This is the first one to resolve so it must not be overridden by the others

        expect(p1 === p2).toBeTruthy();
        expect(p2 === p3).toBeTruthy();

        await expect(searchApi(q3)).resolves.toBe(q3);
        expect(impl.mock.calls.length).toBe(1);
    });

    test("3 calls with last one throwing", async () => {
        const error = "Error";
        const errorMsg = "This is an error!";
        const impl = async (abort: AbortSignal, query: string) => {
            if (query === error) {
                await delay(1);
                throw new Error(errorMsg);
            }
            return delay(50 - query.length, query);
        };

        const searchApi = asyncDebounce(impl);

        const q1 = "Hello",
            q2 = "Hello W",
            q3 = "Error";

        const p1 = searchApi(q1);
        const p2 = searchApi(q2);
        const p3 = searchApi(q3); // This is the first one to resolve so it must not be overridden by the others

        expect(p1 === p2).toBeTruthy();
        expect(p2 === p3).toBeTruthy();

        await expect(p1).rejects.toThrowError(errorMsg);
    });

    test("resuse after result", async () => {
        const error = "Error";
        const errorMsg = "This is an error!";
        const impl = async (abort: AbortSignal, query: string) => {
            if (query === error) {
                await delay(1);
                throw new Error(errorMsg);
            }
            return delay(50 - query.length, query);
        };

        const searchApi = asyncDebounce(impl);

        const q1 = "Hello",
            q2 = "Hello W",
            q3 = "Error";

        const p1 = searchApi(q1);
        const p2 = searchApi(q2);
        const p3 = searchApi(q3); // This is the first one to resolve so it must not be overridden by the others

        expect(p1 === p2).toBeTruthy();
        expect(p2 === p3).toBeTruthy();

        await expect(p1).rejects.toThrowError(errorMsg);

        const p4 = searchApi(q1);
        const p5 = searchApi(q2);

        expect(p3 !== p4).toBeTruthy();
        expect(p4 === p5).toBeTruthy();

        await expect(p4).resolves.toBe(q2);
        await expect(p5).resolves.toBe(q2);
    });
});
