# Kill process occupying port

Simple utility library that simplifies killing process occupying port. Can be used on application lift for killing detached processes (e.g. existing due to terminal crash).


### Usage

```typescript
(async () => {
    // killProcessOccupyingPort(port: number = yargs.argv.port, askQuestion: boolean = true)
    await killProcessOccupyingPort(3000);

    // start server
})();
```
