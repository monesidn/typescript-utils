import getGlobals from "../../misc/getGlobals";
import LogLevel from "../LogLevel";
import Logger from "../Logger";

const globals = getGlobals();

/**
 * A logger that hijack the browser console. It is used to redirect any
 * console.x method to the logger.
 * This class is not meant to be used directly. Call `LoggerManager.hijackConsole()` to use this.
 */
export class ConsoleHijacker {
    public browserConsole = globals.console;

    constructor(public logger: Logger) {
        assertConsoleNotHijacked();

        const hijack = Object.assign(Object.create(console), {
            error: (...params: any[]) => this.log(LogLevel.ERROR, params),
            warn: (...params: any[]) => this.log(LogLevel.WARN, params),
            debug: (...params: any[]) => this.log(LogLevel.DEBUG, params),
            log: (...params: any[]) => this.log(LogLevel.DEBUG, params),
            info: (...params: any[]) => this.log(LogLevel.DEBUG, params),
            logger
        });

        globals.console = hijack;
    }

    private serializeArg(arg: any) {
        switch (typeof arg) {
            case "object":
                try {
                    return JSON.stringify(arg);
                } catch {
                    return "" + arg;
                }
            default:
                return "" + arg;
        }
    }

    log(level: LogLevel, args: any[]) {
        this.logger.log(level, () => args.map((i) => this.serializeArg(i)).join(", "));
    }

    releaseConsole() {
        globals.console = this.browserConsole;
    }
}

/**
 * Method used to prevent multiple hijacking of the browser console.
 */
export const assertConsoleNotHijacked = () => {
    if (globals.console instanceof ConsoleHijacker)
        throw new Error("Console is being already hijacked! Probably you called hijackConsole() multiple times!");
};
