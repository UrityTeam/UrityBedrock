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

const GamePacket = require("./network/mcpe/protocol/GamePacket");
const Config = require("./utils/Config");
const RakNetInterface = require("./network/RakNetInterface");
const Logger = require("./utils/MainLogger");
const fs = require("fs");

class Server {
	/** @type Logger */
	logger;
	/** @type RakNetInterface */
	raknet;

	constructor(path, sn, sv) {
		let start_time = Date.now();
		this.logger = new Logger();
		this.getLogger().info("Loading server...");
		this.getLogger().info("Loading BlueBird.json");
		this.path = path;
		if (!fs.existsSync(this.path.data + "BlueBird.json")) {
			let content = {
				"motd": "BlueBird Server",
				"address": {
					"name": "0.0.0.0",
					"port": 19132,
					"ipv": 4,
				},
				"maxplayers": 20,
				"debug_level": 0,
				"onlinemode": true
			};
			fs.writeFileSync(this.path.data + "BlueBird.json", JSON.stringify(content, null, 4));
		}
		this.bluebirdcfg = new Config(this.path.data + "BlueBird.json", Config.JSON);
		this.getLogger().info("This server is running " + sn + " v" + sv);
		this.getLogger().info("BlueBird is distributed under GPLv3 License");
		this.raknet = new RakNetInterface(this);
		if (this.raknet.raknet.isRunning === true) {
			this.raknet.handle();
		}
		this.getLogger().info("Server listened on " + this.bluebirdcfg.getNested("address.name") + ":" + this.bluebirdcfg.getNested("address.port"));
		this.getLogger().info("Done in (" + (Date.now() - start_time) + "ms).");
	}

	/**
	 * @param players {Player[]}
	 * @param packets {DataPacket[]}
	 * @param forceSync {Boolean}
	 * @param immediate {Boolean}
	 */
	broadcastGamePackets(players, packets, forceSync = false, immediate = false) {
		let targets = [];
		players.forEach(player => {
			if (player.isConnected()) {
				targets.push(this.raknet.players.getPlayer(player.address.toString()));
			}
		});

		if (targets.length > 0) {
			let pk = new GamePacket();

			packets.forEach((packet) => pk.addPacket(packet));

			if (!forceSync && !immediate) {
				this.broadcastPackets([pk], targets, false);
			} else {
				this.broadcastPackets([pk], targets, immediate);
			}
		}
	}

	/**
	 * @returns {MainLogger}
	 */
	getLogger() {
		return this.logger;
	}

	/**
	 * @returns {void}
	 */
	shutdown() {
		this.raknet.shutdown();
		process.exit(1);
	}

	/**
	 * @return {Array}
	 */
	getOnlinePlayers() {
		return Array.from(this.raknet.players.values());
	}

	/**
	 * @param packets {DataPacket[]}
	 * @param targets {Player[]}
	 * @param immediate {Boolean}
	 */
	broadcastPackets(packets, targets, immediate) {
		packets.forEach(pk => {
			if (!pk.isEncoded) {
				pk.encode();
			}

			if (immediate) {
				targets.forEach(player => {
					if (this.raknet.players.has(player.address.toString())) {
						console.log(player);
						this.raknet.players.getPlayer(player.address.toString()).sendDataPacket(pk, true);
					}
				});
			} else {
				targets.forEach(player => {
					if (this.raknet.players.has(player.address.toString())) {
						console.log(player);
						this.raknet.players.getPlayer(player.address.toString()).sendDataPacket(pk);
					}
				});
			}
		});
	}

	/**
	 * @param targets {Player[]}
	 * @param packet {DataPacket}
	 */
	broadcastPacket(targets, packet) {
		packet.encode();
		this.broadcastGamePackets(targets, [packet]);
	}

	/**
	 * @param message {String}
	 * @return {number}
	 */
	broadcastMessage(message) {
		let players = this.getOnlinePlayers();
		players.forEach(players => {
			players.sendMessage(message)
		});
		return players.length;
	}
}

module.exports = Server;
