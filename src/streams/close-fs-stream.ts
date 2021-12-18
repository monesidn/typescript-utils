import { WriteStream, ReadStream } from 'fs';

export const closeFsStream = async (stream: WriteStream | ReadStream) => {
    return new Promise((resolve) => stream.close(resolve));
};
