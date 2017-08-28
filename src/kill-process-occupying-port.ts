// import killProcessOccupyingPort = require('kill-process-occupying-port');
//
// (async () => {
//     await killProcessOccupyingPort();
// })();

import inquirer = require('inquirer');
import yargs = require('yargs');
import portfinder = require('portfinder');
import processPromises = require('ts-process-promises');

// utility functions
export const getProcessPortId = async (port: number): Promise<number> => {
    const result: processPromises.ExecResult = <any>await processPromises.exec(`fuser ${port}/tcp`);
    const id = parseInt(result.stdout, 10);
    return id;
};

export const killProcessByPort = (port: number) => {
    return new Promise(async (resolve, reject) => {
        process.kill(await getProcessPortId(port));

        const interval = setInterval(async () => {
            const freePort = await portfinder.getPortPromise({
                port,
            });

            if (freePort === port) {
                clearInterval(interval);
                return resolve();
            }
        }, 10);
    });
};

export const killProcessOccupyingPort = async (port: number = yargs.argv.port, askQuestion: boolean = true) => {

        const foundPort = await portfinder.getPortPromise({
            port,
        });

        if (foundPort !== port) {
            if (askQuestion) {
                const answer = await inquirer.prompt({
                    message: `Port ${port} is taken. Kill an app using it?`,
                    name: `kill`,
                    type: 'list',
                    choices: ['yes', 'no'],
                });

                if (answer.kill === 'no') {
                    throw new Error(`port ${port} is taken`);
                }
            }

            await killProcessByPort(port);
        }
};
