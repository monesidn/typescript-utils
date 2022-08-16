/**
 * Represents a Task. Each Task is an asyncronous process not
 * started yet.
 */
export interface Task {
    getName(): string;
    run(): Promise<void>;
}

/**
 * Configuration options for the TaskRunner
 */
export interface TaskRunnerOptions {
    /**
     * How many workers should be spawned at the same time?
     */
    maxConcurrentTask?: number;
}
