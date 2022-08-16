import { EmptyFn, Fn } from "../types/functions";

/**
 * A generic event listener function
 */
export type EventListener<T> = Fn<T, any>;

/**
 * Alias for EmptyFn created for the sake of readability.
 */
export type UnregisterFn = EmptyFn;

/**
 * Alternative API to work with event driven tasks. I used to work with
 * the EventEmitter api but this is a fairly old API that doesn't play too
 * well with typescript. To overcome this limitation I decided to provide
 * this new API, which resemble EventEmitter to some extend, and is inspired
 * by the Angular 2+ EventEmitters.
 * The idea is simple: for each event we create an instance of this class that
 * will keep a list of listeners.
 * @example
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
export class EventsSource<T> {
    private listeners: EventListener<T>[] = [];

    /**
     * Adds a new listener. This is an alias for the `addListener` method named
     * like this to resemble the EventEmitter interface.
     * @param listener A listener function.
     * @returns An unregister function. Sometimes it's easier to have a dedicated function
     * to unregister than keeping the listener reference around
     */
    public on(listener: EventListener<T>): UnregisterFn {
        return this.addListener(listener);
    }

    /**
     * Adds a new listener. All listeners will be notified when an event
     * is dispatched.
     * @param listener A listener function.
     * @returns An unregister function. Sometimes it's easier to have a dedicated function
     * to unregister than keeping the listener reference around
     */
    public addListener(listener: EventListener<T>): UnregisterFn {
        this.listeners.push(listener);
        return () => this.removeListener(listener);
    }

    /**
     * Removes a previously registered listener. This is an alias for the `removeListener` method named
     * like this to resemble the EventEmitter interface.
     * @param listener A listener function.
     */
    public off(listener: EventListener<T>) {
        this.removeListener(listener);
    }

    /**
     * Removes a previously registered listener.
     * @param listener A listener function.
     */
    public removeListener(listener: EventListener<T>) {
        const idx = this.listeners.indexOf(listener);
        if (idx >= 0) {
            this.listeners.splice(idx, 1);
        }
    }

    /**
     * Adds a listener that is automatically unregistered after the first execution.
     * @param listener A listener function.
     * @returns An unregister function. Sometimes it's easier to have a dedicated function
     * to unregister than keeping the listener reference around
     */
    public once(listener: EventListener<T>): UnregisterFn {
        return this.addListener((...data) => {
            listener(...data);
            this.removeListener(listener);
        });
    }

    /**
     * Works like `once` but with the added Promise flavour
     */
    public nextEvent(): Promise<T> {
        return new Promise<T>((resolve) => this.once(resolve));
    }

    /**
     * Clears the list of registered listeners.
     */
    public removeAllListeners() {
        this.listeners = [];
    }

    /**
     * Listeners are normally invoked in the order they were registered,
     * this method allow to add a listener that is invoked before any other.
     * The last listener prepended will always be the first one invoked.
     * @param listener A listener function.
     * @returns An unregister function. Sometimes it's easier to have a dedicated function
     * to unregister than keeping the listener reference around
     */
    public prependListener(listener: EventListener<T>) {
        this.listeners.unshift(listener);
        return () => this.removeListener(listener);
    }

    /**
     * Like `prependListener` but register a once listener.
     * @param listener A listener function.
     * @returns An unregister function. Sometimes it's easier to have a dedicated function
     * to unregister than keeping the listener reference around
     */
    public prependOnceListener(listener: EventListener<T>) {
        return this.prependListener((...data) => {
            listener(...data);
            this.removeListener(listener);
        });
    }

    /**
     * Emits a single event by notifying all registered listeners. Listeners
     * are invoked one after the other synchronously. If an event listener
     * throws an error processing stops and the error is propagated.
     * @param data Data passed to all listeners.
     */
    public emit(data: T) {
        for (const listener of this.listeners) {
            listener(data);
        }
    }
}
