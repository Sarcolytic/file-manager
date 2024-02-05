import { homedir } from 'os';
import * as path from 'node:path';
import { printDir, printOperationFailed } from './console.js';
import { access, readdir, writeFile, rename, unlink } from 'node:fs/promises';
import { createReadStream, createWriteStream, constants } from 'node:fs';
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
    return new Promise((resolve) => {
        const stream = createReadStream(path.join(currentDir, filepath));
        stream.on('end', () => {
            console.log('\n');
            resolve();
        });
        stream.on('error', () => {
            printOperationFailed();
            resolve();
        });
        stream.pipe(stdout);
    });
}

export async function add(fileName) {
    const fileExists = await isFileExists(fileName);
    if (fileExists) {
        printOperationFailed();
        return;
    }

    try {
        await writeFile(path.join(currentDir, fileName), '');
    } catch {
        printOperationFailed();
    }
}

async function isFileExists(name) {
    try {
        await access(path.join(currentDir, name), constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

export async function rn({ first: fileName, second: newFileName }) {
    const fileExists = await isFileExists(fileName);
    const newFileExists = await isFileExists(newFileName);
    if (!fileExists || newFileExists) {
        printOperationFailed();
        return;
    }

    try {
        await rename(path.join(currentDir, fileName), path.join(currentDir, newFileName));
    } catch {
        printOperationFailed();
    }
}

export async function cp({ first: origin, second: copyTo }) {
    const isOriginExists = await isFileExists(origin);
    if (!isOriginExists) {
        printOperationFailed();
        return Promise.resolve(false);
    }

    const copyToDir = path.isAbsolute(copyTo) ? copyTo : path.join(currentDir, copyTo);
    try {
        await access(copyToDir);
    } catch {
        printOperationFailed();
        return Promise.resolve(false);
    }

    return new Promise((resolve) => {
        const readStream = createReadStream(path.join(currentDir, origin));
        const writeStream = createWriteStream(path.join(copyToDir, origin));
        writeStream.on('error', () => {
            printOperationFailed();
            resolve(false);
        });

        readStream.on('end', () => {
            console.log('\n');
            resolve(true);
        });
        stream.on('error', () => {
            printOperationFailed();
            resolve();
        });
        readStream.pipe(writeStream);
    });
}

export async function rm(fileName) {
    try {
        await unlink(path.join(currentDir, fileName));
    } catch {
        printOperationFailed();
    }
}

export async function mv({ first: origin, second: moveTo }) {
    const copyResult = await cp({ first: origin, second: moveTo });
    if (!copyResult) {
        return Promise.resolve();
    }

    await rm(origin);
}
