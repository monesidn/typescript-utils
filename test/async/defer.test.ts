import defer from "../../src/async/defer";
import LoggerManager from "../../src/logger/LoggerManager";
import LogLevel from "../../src/logger/LogLevel";

LoggerManager.setDefaultLevel(LogLevel.WARN);
LoggerManager.updateLoggers();

describe("Defer object", () => {
    test("Resolves the defer", async () => {
        const d = defer<boolean>();

        setTimeout(() => d.resolve(true), 10);
        await expect(d.promise).resolves.toBe(true);
    });

    test("Reject the defer", async () => {
        const d = defer<boolean>();

        const error = "Hello error";
        setTimeout(() => d.reject(new Error(error)), 10);
        await expect(d.promise).rejects.toThrowError(error);
    });
});
