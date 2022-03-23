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

const Player = require("../../player/Player");
const Identifiers = require("../mcpe/protocol/Identifiers");
const GamePacket = require("../mcpe/protocol/GamePacket");

class RakNetHandler {

    static handlePlayerConnection(inter, connection){
        let player = new Player(inter.server, connection);
        inter.players.addPlayer(connection.address.toString(), player);
    }

    static handlePlayerDisconnection(inter, address){
        if (inter.players.hasPlayer(address.toString())) {
            inter.players.removePlayer(address.toString());
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
        let player = inter.players.getPlayer(connection.address.toString());
        let pk = new GamePacket();
        pk.buffer = stream.buffer;
        pk.decode();
        pk.handle(player.getNetworkSession());
    }
}

module.exports = RakNetHandler;
