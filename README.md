<p align="center">
    <a href="https://github.com/radarsu/kill-process-on-port/" target="blank"><img src="https://raw.githubusercontent.com/radarsu/kill-process-on-port/master/assets/logo.png" alt="kill-process-on-port" /></a><br/>
    <strong>Not responding, unresponsive process killer. Kill process on port you wanna use.</strong>
</p>

<p align="center">
<a href="https://github.com/Microsoft/TypeScript" target="blank">TypeScript</a> process killer utility function that greatly speeds up development.<br/>
</p>

<p align="center">
	<a href="https://www.npmjs.com/package/kill-process-on-port" target="_blank" alt="npm kill-process-on-port"><img src="https://img.shields.io/npm/v/kill-process-on-port.svg" alt="npm" /></a>
	<img src="https://img.shields.io/github/license/radarsu/kill-process-on-port.svg" />
	<img src="https://img.shields.io/github/stars/radarsu/kill-process-on-port.svg" />
	<a href="https://twitter.com/radarsujs"><img src="https://img.shields.io/twitter/url/https/github.com/radarsu/kill-process-on-port.svg?style=social" /></a>
</p>

## Description

If you work with application that occupies some port and sometimes hangs up - you definitely should start using `kill-process-on-port`. <strong>It shows you a prompt in console</strong>, then you choose to either kill an application occupying port or not. Safe and sound!

## Installation

```sh
npm i kill-process-on-port
```

## Features

- <strong>TypeScript</strong> with documentation in comments.
- <strong>Both Windows and Linux</strong> support. Uses built-in commands: `netstat` on Windows and `fuser` on Linux.
- <strong>Prompts</strong> for confirmation before killing process (by <a href="https://github.com/SBoudrias/Inquirer.js/" target="_blank" alt="inquirer">inquirer</a>).

## Usage
```ts
import {
    killProcessOnPort,
} from 'kill-process-on-port';

(async () => {

    await killProcessOnPort(3000).catch((err) => {
        console.log(err);
    });

})();
```
