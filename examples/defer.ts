import { Defer } from "../src/async";
import { Person } from "./mock-data-model";
import { mockLoadPerson2 } from "./promises";

export async function deferExample() {
    const defer = new Defer<Person>();
    mockLoadPerson2().then((p) => defer.resolve(p));
    return defer.promise;
}
