import {
    execSync,
} from 'child_process';

import {
    getPortPromise,
} from 'portfinder';

import {
    prompt,
} from 'inquirer';

// utility functions
const getProcessPortId = async (port: number): Promise<number> => {
    if (process.platform === 'win32') {
        const res: Buffer = execSync(`netstat -a -n -o | grep '${port}' | grep 'LISTENING'`) as any;
        const text = res.toString().trim();
        const arr = text.split(' ');
        const pid = arr.pop() || ``;
        return parseInt(pid, 10);
    }

    const result = (await execSync(`fuser ${port}/tcp`) as Buffer).toString();
    return parseInt(result, 10);
};

const killByPort = (port: number) => {
    return new Promise(async (resolve) => {
        process.kill(await getProcessPortId(port));

        const interval = setInterval(async () => {
            const freePort = await getPortPromise({
                port,
            });

            if (freePort === port) {
                clearInterval(interval);
                return resolve();
            }
        }, 10);
    });
};

// main function

/**
 * If port is occupied, asks a question if you want to kill it. Say 'yes' and it's dead!
 * @param {number} port
 * @param {boolean} [askQuestion=true]
 */
export const killProcessOnPort = async (port: number, askQuestion: boolean = true) => {
    const foundPort = await getPortPromise({
        port,
    });

    if (foundPort !== port) {
        if (askQuestion) {
            const answer: any = await prompt({
                choices: ['yes', 'no'],
                message: `Port ${port} is taken. Kill an app using it?`,
                name: `kill`,
                type: 'list',
            });

            if (answer.kill === 'no') {
                throw new Error(`Port ${port} is taken.`);
            }
        }

        await killByPort(port);
    }
};

export default killProcessOnPort;