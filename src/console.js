import { homedir } from 'os';
import { stdin } from 'node:process';

let command = '';
let user = '';

export function listenConsole(userName) {
    user = userName;

    setup();
    printHello();
    printDir(homedir());

    stdin.on('data', (key) => {
        // console.log(JSON.stringify(key.toString()));

        // ctrl-c
        if (key === '\u0003') {
            printGoodBuy();
            process.exit();
        }

        // TODO: check win
        if (key === '\r') {
            console.log(`\ncommand: ${command}`);
            command = '';
        } else {
            command += key;
            process.stdout.write(key);
        }
    });
}

function setup() {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
}

function printHello() {
    console.log(`Welcome to the File Manager, ${user}!`);
}

function printGoodBuy() {
    console.log(`Thank you for using File Manager, ${user}, goodbye!`);
}

function printDir(dirName) {
    console.log(`You are currently in ${dirName}`);
}
