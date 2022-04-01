const ConsoleCommandSender = require("./ConsoleCommandSender");
const readline = require("readline");

class ConsoleCommandReader {
    constructor(server){
        let sender = new ConsoleCommandSender(server);

        let rl = readline.createInterface({
            input: process.stdin
        });

        rl.on("line", (input) => {
            server.dispatchCommand(sender, input);
        });
    }
}

module.exports = ConsoleCommandReader;