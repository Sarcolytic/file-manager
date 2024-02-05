import { EOL, cpus, homedir, userInfo, arch } from 'os';
import { printInvalidInput } from './console.js';

const SupportedArgs = {
    EOL: '--EOL',
    CPUS: '--cpus',
    HOMEDIR: '--homedir',
    USERNAME: '--username',
    ARCHITECTURE: '--architecture',
};

export function printInfo(arg) {
    switch (arg) {
        case SupportedArgs.EOL:
            console.log(EOL);
            break;
        case SupportedArgs.CPUS:
            console.log(cpus());
            break;
        case SupportedArgs.HOMEDIR:
            console.log(homedir());
            break;
        case SupportedArgs.USERNAME:
            console.log(userInfo().username);
            break;
        case SupportedArgs.ARCHITECTURE:
            console.log(arch());
            break;
        default:
            printInvalidInput();
    }
}
