const TextFormat = require("../../utils/TextFormat");
const Command = require("../Command");

class HelpCommand extends Command {
    constructor(){
        super("help", "get the help list");
    }

    execute(sender, args){
        sender.sendMessage(TextFormat.GREEN + "-".repeat(15) + " Help List " + "-".repeat(15));
        for(let commands of sender.getServer().getCommandMap().getCommands()){
            sender.sendMessage(`${TextFormat.YELLOW}/${commands.getName()} : ${commands.getDescription()}`);
        }
        sender.sendMessage(TextFormat.GREEN + "-".repeat(41))
    }
}

module.exports = HelpCommand;