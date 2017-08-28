import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const pkg = require('./package.json');
const {
    camelCase
} = require('lodash');

const libraryName = 'kill-process-occupying-port';

export default {
    entry: `compiled/${libraryName}.js`,
    targets: [{
        dest: pkg.main,
        moduleName: camelCase(libraryName),
        format: 'umd'
    }, {
        dest: pkg.module,
        format: 'es'
    }],
    sourceMap: true,
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    plugins: [
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Support for built in modules in node.js (for browser)
        builtins(),
        // Allows bundling jsons
        json(),
        // globals
        globals(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve()
    ],
};
