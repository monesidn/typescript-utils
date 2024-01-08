import delay from "../../src/async/delay";
import EventsSource from "../../src/events/EventsSource";

describe("EventsSource", () => {
    test("Can add listeners using both api styles.", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        const es = new EventsSource<boolean>();
        es.on(listener1);
        es.addListener(listener2);

        es.emit(true);

        expect(listener1.mock.calls).toHaveLength(1);
        expect(listener2.mock.calls).toHaveLength(1);
    });

    test("Can add and remove listeners using both api styles.", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        const es = new EventsSource<boolean>();
        es.on(listener1);
        es.addListener(listener2);

        es.emit(true);

        es.off(listener1);
        es.removeListener(listener2);

        es.emit(true);

        expect(listener1.mock.calls).toHaveLength(1);
        expect(listener2.mock.calls).toHaveLength(1);
    });

    test("Can remove listeners using unregister fn.", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        const es = new EventsSource<boolean>();
        es.on(listener1);
        const unreg2 = es.addListener(listener2);

        es.emit(true);

        unreg2();

        es.emit(true);

        expect(listener1.mock.calls).toHaveLength(2);
        expect(listener2.mock.calls).toHaveLength(1);
    });

    test("PrependListener works as expected.", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn(() => expect(listener1.mock.calls).toHaveLength(0));

        const es = new EventsSource<boolean>();
        es.on(listener1);
        es.prependListener(listener2);

        es.emit(true);

        expect(listener1.mock.calls).toHaveLength(1);
        expect(listener2.mock.calls).toHaveLength(1);
    });

    test("removeAllListeners works as expected.", () => {
        const listener1 = jest.fn();
        const listener2 = jest.fn();

        const es = new EventsSource<boolean>();
        es.on(listener1);
        es.addListener(listener2);

        es.emit(true);

        expect(listener1.mock.calls).toHaveLength(1);
        expect(listener2.mock.calls).toHaveLength(1);

        es.removeAllListeners();

        expect(listener1.mock.calls).toHaveLength(1);
        expect(listener2.mock.calls).toHaveLength(1);
    });

    test("nextEvent works as expected.", async () => {
        const listener1 = jest.fn();

        const es = new EventsSource<boolean>();
        es.nextEvent().then(listener1);

        es.emit(true);

        await delay(); // Wait next tick
        expect(listener1.mock.calls).toHaveLength(1);
    });
});
