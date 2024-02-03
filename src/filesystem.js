import { homedir } from 'os';
import * as path from 'node:path';
import { printDir, printOperationFailed } from './console.js';
import { access, readdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { stdout } from 'node:process';

let currentDir = homedir();

export function up() {
    currentDir = path.normalize(`${currentDir}/..`);
    printDir(currentDir);
}

export async function cd(to) {
    const newDir = path.isAbsolute(to) ? to : path.join(currentDir, to);

    try {
        await access(newDir);
        currentDir = newDir;
    } catch {
        printOperationFailed();
    }

    printDir(currentDir);
}

export async function ls() {
    try {
        const content = await readdir(currentDir, { withFileTypes: true });

        console.table(
            content
                .map((item) => {
                    return {
                        Name: item.name,
                        Type: item.isDirectory() ? 'directory' : 'file',
                    };
                })
                .sort((a, b) => {
                    if (a.Type === 'directory' && b.Type === 'file') {
                        return -1;
                    }

                    if (a.Type === 'file' && b.Type === 'directory') {
                        return 1;
                    }

                    return a.Name.localeCompare(b.Name);
                }),
        );
    } catch {
        printOperationFailed();
    }
}

export function cat(filepath) {
    const stream = createReadStream(path.join(currentDir, filepath));
    stream.pipe(stdout);
    stream.on('end', () => {
        console.log('\n');
        printDir(currentDir);
    });
}
