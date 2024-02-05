import { up, cd, ls, cat, add, rn, cp } from './filesystem.js';
import { printInfo } from './os-info.js';
import { printOperationFailed } from './console.js';

const Commands = {
    UP: 'up',
    CD: 'cd',
    LS: 'ls',
    CAT: 'cat',
    ADD: 'add',
    RN: 'rn',
    CP: 'cp',

    MV: 'mv',
    RM: 'rm',

    OS: 'os',
};

export async function handleCommand(str) {
    const { args, command } = extractCommand(str);
    console.log(`\ncommand: ${command}, args: ${args}`);

    switch (command) {
        case Commands.UP:
            up();
            break;
        case Commands.CD:
            await cd(args);
            break;
        case Commands.LS:
            await ls();
            break;
        case Commands.CAT:
            await cat(args);
            break;
        case Commands.ADD:
            await add(args);
            break;
        case Commands.RN:
            await rn(extractTwoArgs(args));
            break;
        case Commands.CP:
            await cp(extractTwoArgs(args));
            break;
        case Commands.OS:
            printInfo(args);
            break;
    }
}

/**
 * @param str {string}
 * @returns {{args: string, command: string}}
 */
function extractCommand(str) {
    const arr = str.split(' ');
    const command = arr.shift();
    const args = arr.join(' ').trim();

    return {
        command,
        args,
    };
}

/**
 * @param args {string}
 * @returns {{first: string, second: string}}
 */
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
