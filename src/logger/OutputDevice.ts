import LogLevel from "./LogLevel";

/**
 * This interface allows for pluggable print behaviour. The default implementation
 * writes to the global console object but by providing a custom one you can
 * override that.
 */
interface OutputDevice {
    print(level: LogLevel, text: string): void;
}

export default OutputDevice;
