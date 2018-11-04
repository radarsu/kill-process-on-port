import { execSync, } from 'child_process';
import { getPortPromise, } from 'portfinder';
import { prompt, } from 'inquirer';
// utility functions
const getProcessPortId = async (port) => {
    if (process.platform === 'win32') {
        const res = execSync(`netstat -a -n -o | grep '${port}' | grep 'LISTENING'`);
        const text = res.toString().trim();
        const arr = text.split(' ');
        const pid = arr.pop() || ``;
        return parseInt(pid, 10);
    }
    const result = (await execSync(`fuser ${port}/tcp`)).toString();
    return parseInt(result, 10);
};
const killByPort = (port) => {
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
export const killProcessOnPort = async (port, askQuestion = true) => {
    const foundPort = await getPortPromise({
        port,
    });
    if (foundPort !== port) {
        if (askQuestion) {
            const answer = await prompt({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDSCxRQUFRLEdBQ1gsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNILGNBQWMsR0FDakIsTUFBTSxZQUFZLENBQUM7QUFFcEIsT0FBTyxFQUNILE1BQU0sR0FDVCxNQUFNLFVBQVUsQ0FBQztBQUVsQixvQkFBb0I7QUFDcEIsTUFBTSxnQkFBZ0IsR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUFtQixFQUFFO0lBQzdELElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7UUFDOUIsTUFBTSxHQUFHLEdBQVcsUUFBUSxDQUFDLDRCQUE0QixJQUFJLHNCQUFzQixDQUFRLENBQUM7UUFDNUYsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ25DLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUM1QixPQUFPLFFBQVEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDNUI7SUFFRCxNQUFNLE1BQU0sR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLFNBQVMsSUFBSSxNQUFNLENBQVksQ0FBQSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzFFLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUM7QUFFRixNQUFNLFVBQVUsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ2hDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ2pDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTNDLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLGNBQWMsQ0FBQztnQkFDbEMsSUFBSTthQUNQLENBQUMsQ0FBQztZQUVILElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtnQkFDbkIsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QixPQUFPLE9BQU8sRUFBRSxDQUFDO2FBQ3BCO1FBQ0wsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFFRixnQkFBZ0I7QUFFaEI7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFBRSxJQUFZLEVBQUUsY0FBdUIsSUFBSSxFQUFFLEVBQUU7SUFDakYsTUFBTSxTQUFTLEdBQUcsTUFBTSxjQUFjLENBQUM7UUFDbkMsSUFBSTtLQUNQLENBQUMsQ0FBQztJQUVILElBQUksU0FBUyxLQUFLLElBQUksRUFBRTtRQUNwQixJQUFJLFdBQVcsRUFBRTtZQUNiLE1BQU0sTUFBTSxHQUFRLE1BQU0sTUFBTSxDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO2dCQUN0QixPQUFPLEVBQUUsUUFBUSxJQUFJLGtDQUFrQztnQkFDdkQsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUM7WUFFSCxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFFO2dCQUN0QixNQUFNLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsQ0FBQzthQUM3QztTQUNKO1FBRUQsTUFBTSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDMUI7QUFDTCxDQUFDLENBQUM7QUFFRixlQUFlLGlCQUFpQixDQUFDIn0=