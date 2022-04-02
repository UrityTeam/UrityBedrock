//<Buffer 4d 01 2f 00 9b 42 10 24 30 ed ed 23 30 e3 46 db 1e 27 b2 a5 00 00>

const DataPacket = require("./DataPacket");
const Identifiers = require("./Identifiers");

class AvailableCommandsPacket extends DataPacket {
    static NETWORK_ID = Identifiers.AVAILABLE_COMMANDS_PACKET;

    //TODO
}

module.exports = AvailableCommandsPacket;