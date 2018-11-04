/**
 * If port is occupied, asks a question if you want to kill it. Say 'yes' and it's dead!
 * @param {number} port
 * @param {boolean} [askQuestion=true]
 */
export declare const killProcessOnPort: (port: number, askQuestion?: boolean) => Promise<void>;
export default killProcessOnPort;
