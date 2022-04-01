const TextFormat = require("../utils/TextFormat");
const CommandSender = require("./CommandSender");

class CommandMap {
    static list = {};

    register(command){
        if(!(command.getName() in CommandMap.list)){
            CommandMap.list[command.getName()] = command;
        }
    }

    unregister(commandName){
        if(commandName in CommandMap.list){
            delete CommandMap.list[commandName];
        }
    }

    has(commandName){
        if(!(commandName in CommandMap.list)){
            return false;
        }
        return this.get(commandName) !== false;
    }

    get(commandName){
        if(!(commandName in CommandMap.list)){
            return false;
        }
        return CommandMap.list[commandName];
    }

    dispatch(sender, cmd){
        if(cmd === "")return;
        cmd = cmd.split(" ");
        let args = cmd;
        cmd = cmd.shift();

        if(this.has(cmd)){
            let command = this.get(cmd);
            if(sender instanceof CommandSender){
                command.execute(sender, args);
            }
        }else{
            sender.getServer().getLogger().info(TextFormat.DARK_RED + "Unknown command. type 'help' to get list of commands");
        }
    }
}

module.exports = CommandMap;