import getGlobals from "../misc/getGlobals";
import LogLevel from "./LogLevel";
import OutputDevice from "./OutputDevice";

class ConsoleOutputDevice implements OutputDevice {
    constructor(public console = getGlobals().console) {}

    print(level: LogLevel, text: string): void {
        switch (level) {
            case LogLevel.OFF:
                return;
            case LogLevel.ERROR:
                return this.console.error(text);
            case LogLevel.WARN:
                return this.console.warn(text);
            case LogLevel.DEBUG:
                return this.console.log(text);
            case LogLevel.TRACE:
                return this.console.log(text);
        }
    }
}

export default ConsoleOutputDevice;
