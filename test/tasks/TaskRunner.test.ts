import LoggerManager from "../../src/logger/LoggerManager";
import LogLevel from "../../src/logger/LogLevel";
import delay from "../../src/async/delay";
import TaskRunner from "../../src/tasks/TaskRunner";

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
        expect(onComplete.mock.calls).toHaveLength(1);
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
        expect(onComplete.mock.calls).toHaveLength(50);
    });

    test("Synchronously tasks submitted are exectued in following ticks", async () => {
        const onComplete = jest.fn();
        const tr = new TaskRunner();
        tr.submitTask(async () => onComplete());

        expect(onComplete.mock.calls).toHaveLength(0);
        await tr.waitForCompletion();
        expect(onComplete.mock.calls).toHaveLength(1);
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
        expect(onComplete.mock.calls).toHaveLength(taskCount);
        expect(onCompleteListener.mock.calls).toHaveLength(taskCount);
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
            expect(onComplete.mock.calls).toHaveLength(onCompleteListener.mock.calls.length);
        });

        await tr.waitForCompletion();
        expect(onComplete.mock.calls).toHaveLength(taskCount);
        expect(onCompleteListener.mock.calls).toHaveLength(taskCount);
    });
});
