"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const yargs = require("yargs");
const portfinder = require("portfinder");
const processPromises = require("ts-process-promises");
exports.getProcessPortId = (port) => __awaiter(this, void 0, void 0, function* () {
    const result = yield processPromises.exec(`fuser ${port}/tcp`);
    const id = parseInt(result.stdout, 10);
    return id;
});
exports.killProcessByPort = (port) => {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        process.kill(yield exports.getProcessPortId(port));
        const interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const freePort = yield portfinder.getPortPromise({
                port,
            });
            if (freePort === port) {
                clearInterval(interval);
                return resolve();
            }
        }), 10);
    }));
};
exports.killProcessOccupyingPort = (port = yargs.argv.port, askQuestion = true) => __awaiter(this, void 0, void 0, function* () {
    const foundPort = yield portfinder.getPortPromise({
        port,
    });
    if (foundPort !== port) {
        const answer = yield inquirer.prompt({
            message: `Port ${port} is taken. Kill an app using it?`,
            name: `kill`,
            type: 'list',
            choices: ['yes', 'no'],
        });
        if (answer.kill === 'no') {
            throw new Error(`port ${port} is taken`);
        }
        yield exports.killProcessByPort(port);
    }
});
//# sourceMappingURL=kill-process-occupying-port.js.map