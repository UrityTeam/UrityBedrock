const TextFormat = require("../../utils/TextFormat");
const Command = require("../Command");

class HelpCommand extends Command {
    constructor(){
        super("help");
    }

    execute(sender, args){
        sender.sendMessage(TextFormat.GREEN + "-".repeat(15) + " Help List " + "-".repeat(15));
        sender.sendMessage(TextFormat.YELLOW + "/help : get the help list");
        sender.sendMessage(TextFormat.YELLOW + "/stop : stop the server");
        sender.sendMessage(TextFormat.YELLOW + "/say : broadcast a message to the players");
        sender.sendMessage(TextFormat.YELLOW + "/title : send a title to a player");
        sender.sendMessage(TextFormat.GREEN + "-".repeat(41))
    }
}

module.exports = HelpCommand;