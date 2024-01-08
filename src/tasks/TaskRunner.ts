import delay from "../async/delay";
import EventsSource from "../events/EventsSource";
import GeneratorFn from "../functions/GeneratorFn";
import isFunction from "../functions/isFunction";
import LoggerManager from "../logger/LoggerManager";
import SimpleTask from "./SimpleTask";
import Task from "./Task";

const log = LoggerManager.getLogger("it.dmonesi.util.async.TaskRunner");

/**
 * Configuration options for the TaskRunner
 */
export interface TaskRunnerOptions {
    /**
     * How many workers should be spawned at the same time?
     */
    maxConcurrentTask?: number;
}

const defaultOpts: TaskRunnerOptions = {
    maxConcurrentTask: 10
};

/**
 * Internal class that does the heavy work.
 */
class TaskRunnerWorker {
    constructor(public parent: TaskRunner, public id: number) {}

    async run() {
        // We wait next tick for starting the actual work  as we don't want to start
        // processing Task synchronously.
        await delay();

        log.debugEnabled() && log.debug(`Worker ${this.id} starting`);

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const nextTask = this.parent.taskQueue.shift();
            if (!nextTask) break;

            try {
                await nextTask.run();
                log.debugEnabled() && log.debug(`Task ${nextTask.getName()} completed successfully`);
                this.parent.events.taskCompleted.emit(nextTask);
            } catch (err) {
                log.error(`Error while executing task ${nextTask.getName()} - ${err}`);
                this.parent.events.taskError.emit([nextTask, err]);
            }
        }
        log.debugEnabled() && log.debug(`Worker ${this.id} stopping`);
    }
}

/**
 * Runs a list of tasks one with the configured concurrency. When `maxConcurrentTask` is
 * set to 1 this class behaves like a task queue.
 * You can obtain info about tasks by listening to the events exposed by this class. See
 * the `events` property for more information.
 * @example
 * In this example we simulate fetching 30 different people from an API. We simulated
 * random fetching time that, by running the example, will result in out-of-order fetching.
 * ```typescript
 * const log = LoggerManager.getLogger("examples.task-runner-simple");
 *
 * let personGenerated = 0;
 * const genPerson = (): Person => {
 *     const personNo = ++personGenerated;
 *     return {
 *         name: `John ${personNo}`,
 *         surname: `Doe ${personNo}`,
 *         email: `jdoe${personNo}@mailinator.com`,
 *         username: `john${personNo}`
 *     };
 * };
 *
 * const tr = new TaskRunner();
 * tr.events.taskCompleted.addListener(() => log.debug(`${people.length} people fetched so far`));
 * tr.waitForCompletion().then(() => log.debug("Execution complete"));
 *
 * const people: Person[] = [];
 * for (let i = 0; i < 30; i++) {
 *     tr.submitTask(async () => {
 *         await delay(Math.round(Math.random() * 10));
 *         const p = genPerson();
 *         people.push(p);
 *     });
 * }
 * ```
 */
class TaskRunner {
    private _activeTasks = 0;
    private _lastWorkerId = 0;

    /**
     * Pending tasks.
     */
    taskQueue: Task[] = [];

    /**
     * Options passed to the constructor after applying default values.
     */
    opts: Required<TaskRunnerOptions>;

    /**
     * We group event sources into this sub-object to make the code more readable.
     */
    public events = {
        /**
         * Emits an event any time a task is completed. The only argument given is
         * the completed task itself.
         */
        taskCompleted: new EventsSource<Task>(),

        /**
         * Emits an event any time a task throws an error. The first argument given is
         * the task itself while the second the thrown error.
         */
        taskError: new EventsSource<[Task, any]>(),

        /**
         * Emits an event any time the TaskRunner completes all pending tasks and has nothing
         * left to do.
         */
        allTasksCompleted: new EventsSource<void>()
    };

    /**
     * Constructs a new TaskRunner.
     * @param opts - The following options can be provided:
     * `maxConcurrentTask`: Max number of task executed concurrently. Extra tasks will be queued and
     * executed when there will be room available.
     */
    constructor(opts: TaskRunnerOptions = {}) {
        this.opts = Object.assign({}, defaultOpts, opts) as Required<TaskRunnerOptions>;
    }

    private async _spawnWorker() {
        if (this._activeTasks >= this.opts.maxConcurrentTask) return;

        const workerId = ++this._lastWorkerId;
        log.debugEnabled() && log.debug(`Spawning (new) worker #${workerId}.`);
        this._activeTasks++;
        const worker = new TaskRunnerWorker(this, workerId);
        await worker.run();
        this._activeTasks--;

        if (this._activeTasks === 0) {
            log.debugEnabled() && log.debug("Last Worker completed the job. The TaskRunner is now idle.");
            this.events.allTasksCompleted.emit();
        }
    }

    /**
     * Convenience method to wait for the next `allTasksCompleted` event
     */
    async waitForCompletion() {
        return this.events.allTasksCompleted.nextEvent();
    }

    /**
     * Returns `true` if no task is running and nothing is available in the queue.
     */
    isIdle() {
        return this._activeTasks === 0 && this.taskQueue.length === 0;
    }

    /**
     * Adds a new task to the runner that will be executed as soon as possible.
     * @param task An object implementing the task interface or a function providing only the logic
     * to execute. If using the latter one than a SimpleTask object is created.
     */
    submitTask(task: Task | GeneratorFn<any>) {
        if (isFunction(task)) {
            this.taskQueue.push(new SimpleTask(task));
        } else {
            this.taskQueue.push(task);
        }
        this._spawnWorker();
    }
}

export default TaskRunner;
