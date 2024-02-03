import { up, cd, ls } from './filesystem.js';

const Commands = {
    UP: 'up',
    CD: 'cd',
    LS: 'ls',
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
    const args = arr.join(' ');

    return {
        command,
        args,
    };
}
