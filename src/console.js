import { homedir } from 'os';
import { stdin, stdout } from 'node:process';
import { handleCommand } from './commands.js';
import * as readline from 'node:readline';

let user = '';

export function initConsole(userName) {
    user = userName;

    printHello();
    printDir(homedir());

    stdin.setEncoding('utf8');
    listen();
}

function listen() {
    const rl = readline.createInterface(stdin, stdout);
    rl.on('line', (input) => {
        handleCommand(input);
    });

    rl.on('SIGINT', () => {
        printGoodBuy();
        rl.close();
    });
}

function printHello() {
    console.log(`Welcome to the File Manager, ${user}!`);
}

function printGoodBuy() {
    console.log(`Thank you for using File Manager, ${user}, goodbye!`);
}

export function printDir(dirName) {
    console.log(`You are currently in ${dirName}`);
}
