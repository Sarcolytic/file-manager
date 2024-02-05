import { createReadStream } from 'node:fs';
import * as crypto from 'node:crypto';
import { printOperationFailed } from './console.js';

export function createHash(fileName) {
    return new Promise((resolve) => {
        const hash = crypto.createHash('sha256');

        const input = createReadStream(fileName);
        input
            .on('readable', () => {
                const data = input.read();
                if (data) hash.update(data);
                else {
                    console.log(`${hash.digest('hex')} ${fileName}`);
                    resolve();
                }
            })
            .on('error', () => {
                printOperationFailed();
            });
    });
}
