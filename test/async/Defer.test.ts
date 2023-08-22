import { describe, expect, test } from "@jest/globals";
import { Defer } from "../../src/async";
import { LoggerManager, LogLevel } from "../../src/logger";

LoggerManager.setDefaultLevel(LogLevel.WARN);
LoggerManager.updateLoggers();

describe("Defer object", () => {
    test("Resolves the defer", async () => {
        const defer = new Defer<boolean>();

        setTimeout(() => defer.resolve(true), 10);
        await expect(defer.promise).resolves.toBe(true);
    });

    test("Reject the defer", async () => {
        const defer = new Defer<boolean>();

        const error = "Hello error";
        setTimeout(() => defer.reject(new Error(error)), 10);
        await expect(defer.promise).rejects.toThrowError(error);
    });
});
