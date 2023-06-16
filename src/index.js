import { pipeline } from 'node:stream/promises';
import { createReadStream } from 'node:fs';

import csvParser from 'csv-parser';
import { SplitIntoChunksStream } from './split-into-chunks.js';
import { ProccessChunksStream } from './process-chunks.js';

const publishToSQS = async (rows) => {
    const sleep = () => new Promise(resolve => setTimeout(resolve, 2000));

    await sleep();
    console.log('async function executed', { rows });
}

const readObjectFromS3 = ({ onReadChunk }) => {
    const s3Stream = createReadStream('./data/ids.csv');

    const splitChunks = new SplitIntoChunksStream();
    const execOnReadFn = new ProccessChunksStream(onReadChunk);

    return pipeline(s3Stream, csvParser(), splitChunks, execOnReadFn);
};

export const handler = async (_) => {
    await readObjectFromS3({
        onReadChunk: publishToSQS,
    });
}

handler();
