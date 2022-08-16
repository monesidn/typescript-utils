import { describe, test, expect } from "@jest/globals";
import { delay, TaskRunner } from "../../src/async";
import { LoggerManager, LogLevel } from "../../src/logger";

LoggerManager.setDefaultLevel(LogLevel.WARN);
LoggerManager.updateLoggers();

describe("Task Runner general behavior", () => {
    test("Async task is successfully executed", async () => {
        const onComplete = jest.fn();
        const tr = new TaskRunner();
        tr.submitTask(async () => {
            await delay(10);
            onComplete();
        });

        await tr.waitForCompletion();
        expect(onComplete).toBeCalled();
    });

    test("50 Async tasks are successfully executed", async () => {
        const onComplete = jest.fn();
        const tr = new TaskRunner();
        for (let i = 0; i < 50; i++) {
            tr.submitTask(async () => {
                await delay(10);
                onComplete();
            });
        }

        await tr.waitForCompletion();
        expect(onComplete).toBeCalledTimes(50);
    });

    test("Synchronously tasks submitted are exectued in following ticks", async () => {
        const onComplete = jest.fn();
        const tr = new TaskRunner();
        tr.submitTask(async () => onComplete());

        expect(onComplete).not.toBeCalled();
        await tr.waitForCompletion();
        expect(onComplete).toBeCalled();
    });
});

describe("Task Runner events", () => {
    test("Completed event are dispatched after each task", async () => {
        const taskCount = 50;

        const onComplete = jest.fn();
        const onCompleteListener = jest.fn();

        const tr = new TaskRunner();
        for (let i = 0; i < taskCount; i++) {
            tr.submitTask(async () => {
                await delay(10);
                onComplete();
            });
        }
        tr.events.taskCompleted.on(onCompleteListener);

        await tr.waitForCompletion();
        expect(onComplete).toBeCalledTimes(taskCount);
        expect(onCompleteListener).toBeCalledTimes(taskCount);
    });

    test("Event listeners are notified in the right order", async () => {
        const taskCount = 50;

        const onComplete = jest.fn();
        const onCompleteListener = jest.fn();

        const tr = new TaskRunner();
        for (let i = 0; i < taskCount; i++) {
            tr.submitTask(async () => {
                await delay(10);
                onComplete();
            });
        }
        tr.events.taskCompleted.on(onCompleteListener);
        tr.events.taskCompleted.on(() => {
            expect(onComplete).toBeCalledTimes(onCompleteListener.mock.calls.length);
        });

        await tr.waitForCompletion();
        expect(onComplete).toBeCalledTimes(taskCount);
        expect(onCompleteListener).toBeCalledTimes(taskCount);
    });
});
