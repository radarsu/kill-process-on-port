export declare const getProcessPortId: (port: number) => Promise<number>;
export declare const killProcessByPort: (port: number) => Promise<{}>;
export declare const killProcessOccupyingPort: (port?: number, askQuestion?: boolean) => Promise<void>;
