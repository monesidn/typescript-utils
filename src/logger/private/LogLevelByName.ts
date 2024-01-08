import LogLevel from "../LogLevel";

/**
 * Map object that associate each level name to the corresponding
 * LogLevel enum element.
 */
const LogLevelByName: Record<string, LogLevel> = {
    OFF: LogLevel.OFF,
    ERROR: LogLevel.ERROR,
    WARN: LogLevel.WARN,
    DEBUG: LogLevel.DEBUG,
    TRACE: LogLevel.TRACE
};

export default LogLevelByName;
