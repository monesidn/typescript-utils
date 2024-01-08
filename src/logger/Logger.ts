import LogLevel from "./LogLevel";

/**
 * Any logger method can also take a function as argument. The function is
 * invoked only if the record is actually generated.
 */
export type LogRecordGenerator = () => string;

/**
 * Defines a logger that can be retrived from the LoggerManager.
 * This is the main interface used to output messages.
 */
interface Logger {
    log(level: LogLevel, record: string | LogRecordGenerator): void;
    isLevelEnabled(level: LogLevel): boolean;

    error(record: string | LogRecordGenerator): void;
    errorEnabled(): boolean;
    warn(record: string | LogRecordGenerator): void;
    warnEnabled(): boolean;
    debug(record: string | LogRecordGenerator): void;
    debugEnabled(): boolean;
    trace(record: string | LogRecordGenerator): void;
    traceEnabled(): boolean;
}

export default Logger;
