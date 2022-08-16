import { Transform, TransformCallback } from "stream";
import { createHash } from "crypto";

/**
 * A node stream that computes the md5 of data passing through it.
 */
export class Md5PassThroughStrean extends Transform {
    hash = createHash("md5");

    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        this.hash.update(chunk);
        this.push(chunk, encoding);
        callback();
    }
}
