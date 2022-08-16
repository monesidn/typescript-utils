import { Defer, delay } from "../src/async";
import { Person } from "./mock-data-model";

export async function mockLoadPerson1(): Promise<Person> {
    await delay(100); // We simulate an async response
    return {
        name: "John",
        surname: "Doe",
        email: "jdoe@mailinator.com",
        username: "john"
    };
}

export async function mockLoadPerson2(): Promise<Person> {
    return delay(100, {
        name: "John",
        surname: "Doe",
        email: "jdoe@mailinator.com",
        username: "john"
    });
}
