import { homedir } from 'os';
import * as path from 'node:path';
import { printDir } from './console.js';
import { access } from 'node:fs/promises';

let currentDir = homedir();

export function up() {
    currentDir = path.normalize(`${currentDir}/..`);
    printDir(currentDir);
}

export async function cd(to) {
    const newDir = path.join(currentDir, to);

    try {
        await access(newDir);
        currentDir = newDir;
    } catch {
        console.log('Operation failed');
    }

    printDir(currentDir);
}
