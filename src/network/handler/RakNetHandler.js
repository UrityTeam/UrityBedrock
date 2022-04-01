/******************************************\
 *  ____  _            ____  _         _  *
 * | __ )| |_   _  ___| __ )(_)_ __ __| | *
 * |  _ \| | | | |/ _ \  _ \| | '__/ _` | *
 * | |_) | | |_| |  __/ |_) | | | | (_| | *
 * |____/|_|\__,_|\___|____/|_|_|  \__,_| *
 *                                        *
 * This file is licensed under the GNU    *
 * General Public License 3. To use or    *
 * modify it you must accept the terms    *
 * of the license.                        *
 * ___________________________            *
 * \ @author BlueBirdMC Team /            *
\******************************************/

const Identifiers = require("../mcpe/protocol/Identifiers");
const GamePacket = require("../mcpe/protocol/GamePacket");
const Player = require("../../Player");

class RakNetHandler {

    static handlePlayerConnection(raknet, connection){
        let player = new Player(raknet.server, connection);
        if(!(connection.address.toString() in raknet.players)){
            raknet.players[connection.address.toString()] = player;
        }
    }

    static handlePlayerDisconnection(raknet, address){
        if (address.toString() in raknet.players) {
            delete raknet.players[address.toString()];
        }
    }

    static updatePong(raknet){
        let interval = setInterval(() => {
            if(raknet.raknet.isRunning === true){
                raknet.raknet.message = "MCPE;" + raknet.bluebirdcfg.get("motd") + ";" + Identifiers.CURRENT_PROTOCOL + ";" + Identifiers.MINECRAFT_VERSION + ";" + raknet.server.getOnlinePlayers().length + ";" + raknet.bluebirdcfg.get("maxplayers") + ";" + raknet.raknet.serverGUID.toString() + ";";
            }else{
                clearInterval(interval);
            }
        });
    }

    static handlePackets(raknet, stream, connection){
        if(connection.address.toString() in raknet.players){
            let player = raknet.players[connection.address.toString()];
            let pk = new GamePacket();
            pk.buffer = stream.buffer;
            pk.decode();
            pk.handle(player.getNetworkSession());
        }
    }
}

module.exports = RakNetHandler;
