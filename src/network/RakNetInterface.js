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

const { RakNetServer, InternetAddress, Frame, ReliabilityTool } = require("bbmc-raknet");
const GamePacket = require("./mcpe/protocol/GamePacket");
const PlayerList = require("../player/PlayerList");
const Logger = require("../utils/MainLogger");
const PacketPool = require("./mcpe/protocol/PacketPool");
const Config = require("../utils/Config");
const BinaryStream = require("bbmc-binarystream");
const RakNetHandler = require("./handler/RakNetHandler");

class RakNetInterface {
	/** @type MainLogger */
	logger;
	/** @type PlayerList */
	players;
	/** @type {RakNetServer, EventEmitter} */
	raknet;
	/** @type Config */
	bluebirdcfg;
	/** @type Server */
	server;

	constructor(server) {
		PacketPool.init();
		this.server = server;
		this.bluebirdcfg = new Config("BlueBird.json", Config.JSON);
		this.logger = new Logger();
		this.raknet = new RakNetServer(new InternetAddress
			(this.bluebirdcfg.getNested("address.name"),
			this.bluebirdcfg.getNested("address.port"),
			this.bluebirdcfg.getNested("address.ipv")),
			10);
		this.players = new PlayerList();
		this.logger.setDebuggingLevel(this.bluebirdcfg.get("debug_level"));
	}

	queuePacket(player, packet, immediate) {
		if (this.players.hasPlayer(player.address.toString())) {
			if (!packet.isEncoded) {
				packet.encode();
			}
			if (packet instanceof GamePacket) {
				let frame = new Frame();
				frame.reliability = ReliabilityTool.UNRELIABLE;
				frame.isFragmented = false;
				frame.stream = new BinaryStream(packet.buffer);
				player.connection.addToQueue(frame);
			} else {
				this.server.broadcastGamePackets([player], [packet], true, immediate);
			}
		}
	}

	handle() {
		RakNetHandler.updatePong(this);

		this.raknet.on('connect', (connection) => {
			RakNetHandler.handlePlayerConnection(this, connection);
		});

		this.raknet.on('disconnect', (address) => {
			RakNetHandler.handlePlayerDisconnection(this, address);
		});

		this.raknet.on('packet', (stream, connection) => {
			RakNetHandler.handlePackets(this, stream, connection);
		});
	}

	close(address, reason) {
		inter.players.getPlayer(address.toString()).disconnect(reason);
	}

	shutdown() {
		this.raknet.isRunning = false;
	}
}

module.exports = RakNetInterface;
