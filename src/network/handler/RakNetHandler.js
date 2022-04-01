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

    static handlePlayerConnection(inter, connection){
        let player = new Player(inter.server, connection);
        if(!(connection.address.toString() in inter.players)){
            inter.players[connection.address.toString()] = player;
        }
    }

    static handlePlayerDisconnection(inter, address){
        if (address.toString() in inter.players) {
            delete inter.players[address.toString()];
        }
    }

    static updatePong(inter){
        let interval = setInterval(() => {
            if(inter.raknet.isRunning === true){
                inter.raknet.message = "MCPE;" + inter.bluebirdcfg.get("motd") + ";" + Identifiers.CURRENT_PROTOCOL + ";" + Identifiers.MINECRAFT_VERSION + ";" + inter.server.getOnlinePlayers().length + ";" + inter.bluebirdcfg.get("maxplayers") + ";" + inter.raknet.serverGUID.toString() + ";";
            }else{
                clearInterval(interval);
            }
        });
    }

    static handlePackets(inter, stream, connection){
        if(connection.address.toString() in inter.players){
            let player = inter.players[connection.address.toString()];
            let pk = new GamePacket();
            pk.buffer = stream.buffer;
            pk.decode();
            pk.handle(player.getNetworkSession());
        }
    }
}

module.exports = RakNetHandler;
