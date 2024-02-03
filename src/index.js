import { initConsole } from './console.js';
import { argv } from 'node:process';

function start() {
    const user = getUserName();
    initConsole(user);
}

function getUserName() {
    const userArg = argv[2];
    if (!userArg) {
        console.log('Argument "--username" is required!');
        process.exit(1);
    }

    return userArg.split('=')[1];
}

start();
