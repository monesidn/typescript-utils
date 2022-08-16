import { WriteStream, ReadStream } from "fs";

/**
 * Wrapper around stream.close used to await for stream to close.
 * @param stream
 * @returns
 */
export const closeFsStream = async (stream: WriteStream | ReadStream) => {
    return new Promise((resolve) => stream.close(resolve));
};
