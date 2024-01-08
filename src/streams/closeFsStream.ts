import { WriteStream, ReadStream } from "fs";

/**
 * Wrapper around stream.close used to await for stream to close.
 * @param stream
 * @returns
 */
const closeFsStream = async (stream: WriteStream | ReadStream) => {
    return new Promise((resolve) => stream.close(resolve));
};

export default closeFsStream;
