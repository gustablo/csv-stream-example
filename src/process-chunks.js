import { Writable } from 'node:stream';

export class ProccessChunksStream extends Writable {
    constructor(callback) {
        super({ objectMode: true });
        this.callback = callback;
    }

    async _write(chunk, _encode, next) {
        await this.callback(chunk);
        next();
    }
}

