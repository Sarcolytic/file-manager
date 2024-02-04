import { homedir } from 'os';
import * as path from 'node:path';
import { printDir, printOperationFailed } from './console.js';
import { access, readdir, writeFile, rename } from 'node:fs/promises';
import { createReadStream, constants } from 'node:fs';
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

export async function rn(args) {
    const { first: fileName, second: newFileName } = extractTwoArgs(args);

    const fileExists = await isFileExists(fileName);
    const newFileExists = await isFileExists(newFileName);
    if (!fileExists && newFileExists) {
        printOperationFailed();
        return;
    }

    try {
        await rename(path.join(currentDir, fileName), path.join(currentDir, newFileName));
    } catch {
        printOperationFailed();
    }
}

function extractTwoArgs(args) {
    const arr = args.split(' ');

    if (arr.length < 2) {
        printOperationFailed();
    }

    return {
        first: arr[0].trim(),
        second: arr[1].trim(),
    };
}
