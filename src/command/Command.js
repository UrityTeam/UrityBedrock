class Command {
    name;

    constructor(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }

    execute(sender, args){}
}

module.exports = Command;