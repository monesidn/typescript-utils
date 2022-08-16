import { delay, TaskRunner } from "../src/async";
import { LoggerManager } from "../src/logger";
import { Person } from "./mock-data-model";

const log = LoggerManager.getLogger("examples.task-runner-simple");

let personGenerated = 0;
const genPerson = (): Person => {
    const personNo = ++personGenerated;
    return {
        name: `John ${personNo}`,
        surname: `Doe ${personNo}`,
        email: `jdoe${personNo}@mailinator.com`,
        username: `john${personNo}`
    };
};

const tr = new TaskRunner();
tr.events.taskCompleted.addListener(() => log.debug(`${people.length} people fetched so far`));
tr.waitForCompletion().then(() => log.debug("Execution complete"));

const people: Person[] = [];
for (let i = 0; i < 30; i++) {
    tr.submitTask(async () => {
        await delay(Math.round(Math.random() * 10));
        const p = genPerson();
        people.push(p);
    });
}
