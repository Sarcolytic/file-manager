import { homedir } from 'os';
import * as path from 'node:path';
import { printDir } from './console.js';

let currentDir = homedir();

export function up() {
    currentDir = path.normalize(`${currentDir}/..`);
    printDir(currentDir);
}

export function cd(to) {
    currentDir = path.join(currentDir, to);
    printDir(currentDir);
}
