"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const portfinder_1 = require("portfinder");
const inquirer_1 = require("inquirer");
// utility functions
const getProcessPortId = async (port) => {
    if (process.platform === 'win32') {
        const res = child_process_1.execSync(`netstat -a -n -o | grep '${port}' | grep 'LISTENING'`);
        const text = res.toString().trim();
        const arr = text.split(' ');
        const pid = arr.pop() || ``;
        return parseInt(pid, 10);
    }
    const result = (await child_process_1.execSync(`fuser ${port}/tcp`)).toString();
    return parseInt(result, 10);
};
const killByPort = (port) => {
    return new Promise(async (resolve) => {
        process.kill(await getProcessPortId(port));
        const interval = setInterval(async () => {
            const freePort = await portfinder_1.getPortPromise({
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
exports.killProcessOnPort = async (port, askQuestion = true) => {
    const foundPort = await portfinder_1.getPortPromise({
        port,
    });
    if (foundPort !== port) {
        if (askQuestion) {
            const answer = await inquirer_1.prompt({
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
exports.default = exports.killProcessOnPort;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBRXVCO0FBRXZCLDJDQUVvQjtBQUVwQix1Q0FFa0I7QUFFbEIsb0JBQW9CO0FBQ3BCLE1BQU0sZ0JBQWdCLEdBQUcsS0FBSyxFQUFFLElBQVksRUFBbUIsRUFBRTtJQUM3RCxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1FBQzlCLE1BQU0sR0FBRyxHQUFXLHdCQUFRLENBQUMsNEJBQTRCLElBQUksc0JBQXNCLENBQVEsQ0FBQztRQUM1RixNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDO1FBQzVCLE9BQU8sUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM1QjtJQUVELE1BQU0sTUFBTSxHQUFHLENBQUMsTUFBTSx3QkFBUSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQVksQ0FBQSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzFFLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFFRixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ2hDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLDJCQUFjLENBQUM7Z0JBQ2xDLElBQUk7YUFDUCxDQUFDLENBQUM7WUFFSCxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7Z0JBQ25CLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDeEIsT0FBTyxPQUFPLEVBQUUsQ0FBQzthQUNwQjtRQUNMLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBRUYsZ0JBQWdCO0FBRWhCOzs7O0dBSUc7QUFDVSxRQUFBLGlCQUFpQixHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsY0FBdUIsSUFBSSxFQUFFLEVBQUU7SUFDakYsTUFBTSxTQUFTLEdBQUcsTUFBTSwyQkFBYyxDQUFDO1FBQ25DLElBQUk7S0FDUCxDQUFDLENBQUM7SUFFSCxJQUFJLFNBQVMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsSUFBSSxXQUFXLEVBQUU7WUFDYixNQUFNLE1BQU0sR0FBUSxNQUFNLGlCQUFNLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUM7Z0JBQ3RCLE9BQU8sRUFBRSxRQUFRLElBQUksa0NBQWtDO2dCQUN2RCxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsTUFBTTthQUNmLENBQUMsQ0FBQztZQUVILElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLFlBQVksQ0FBQyxDQUFDO2FBQzdDO1NBQ0o7UUFFRCxNQUFNLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQjtBQUNMLENBQUMsQ0FBQztBQUVGLGtCQUFlLHlCQUFpQixDQUFDIn0=