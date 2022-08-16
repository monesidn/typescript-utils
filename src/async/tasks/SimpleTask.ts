import { GeneratorFn } from "../../types/functions";
import { Task } from "./api";

let taskId = 0;

/**
 * Simple implementation of the Task interface that takes only a callback
 * and execute it when it's time. The task name is automatically generated.
 */
export class SimpleTask implements Task {
    private _id = taskId++;

    /**
     * @param fn The function providing the logic to run. The return value is ignored and
     * coerced to a Promise
     */
    constructor(private fn: GeneratorFn<any>) {}

    getName() {
        return `SimpleTask#${this._id}`;
    }

    async run(): Promise<void> {
        await this.fn();
    }
}
