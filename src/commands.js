import { up, cd, ls, cat } from './filesystem.js';
import { printInfo } from './os-info.js';

const Commands = {
    UP: 'up',
    CD: 'cd',
    LS: 'ls',
    CAT: 'cat',

    OS: 'os',
};

export async function handleCommand(str) {
    const { args, command } = extractCommand(str);
    console.log(`\ncommand: ${command}, args: ${args}`);

    switch (command) {
        case Commands.UP: {
            up();
            break;
        }
        case Commands.CD: {
            await cd(args);
            break;
        }
        case Commands.LS: {
            await ls();
            break;
        }
        case Commands.CAT: {
            cat(args);
            break;
        }
        case Commands.OS: {
            printInfo(args);
            break;
        }
    }
}

/**
 *
 * @param str
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
