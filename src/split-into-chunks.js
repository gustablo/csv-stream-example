import { Transform } from 'node:stream';

const ROWS_PER_QUEUE = 100;

export class SplitIntoChunksStream extends Transform {
    constructor() {
        super({ objectMode: true });

        this.items = [];
    }

    _transform(chunk, _encode, next) {
        this.items.push(chunk);

        if (this.isLimitReached()) {
            next(null, this.items);
            this.items = [];
            return;
        }

        next(null);
    }

    _flush(done) {
        done(null, this.items);
    }

    isLimitReached() {
        return this.items.length > ROWS_PER_QUEUE;
    }
}
