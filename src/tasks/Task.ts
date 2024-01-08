/**
 * Represents a Task. Each Task is an asyncronous process not
 * started yet.
 */
interface Task {
    getName(): string;
    run(): Promise<void>;
}

export default Task;
