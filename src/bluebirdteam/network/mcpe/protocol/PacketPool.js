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

const Login = require("./LoginPacket");
const PlayStatus = require("./PlayStatusPacket");
const ResourcePackClientResponse = require("./ResourcePackClientResponsePacket");
const ResourcePacksInfo = require("./ResourcePacksInfoPacket");
const ResourcePackStack = require("./ResourcePackStackPacket");
const StartGame = require("./StartGamePacket");
const CreativeContent = require("./CreativeContentPacket");
const BiomeDefinitionList = require("./BiomeDefinitionListPacket");
const Text = require("./TextPacket");
const SetTitle = require("./SetTitlePacket");
const DisconnectPacket = require("./DisconnectPacket");
const PlayerSkin = require("./PlayerSkinPacket");
const SetLocalPlayerAsInitialized = require("./SetLocalPlayerAsInitializedPacket");
const AvailableActorIdentifiers = require("./AvailableActorIdentifiersPacket");

class PacketPool {

	static #pool = new Map();

	static init() {
		this.registerPacket(Login);
		this.registerPacket(PlayStatus);
		this.registerPacket(ResourcePacksInfo);
		this.registerPacket(ResourcePackClientResponse);
		this.registerPacket(ResourcePackStack);
		this.registerPacket(StartGame);
		this.registerPacket(BiomeDefinitionList);
		this.registerPacket(CreativeContent);
		this.registerPacket(Text);
		this.registerPacket(SetTitle);
		this.registerPacket(DisconnectPacket);
		this.registerPacket(SetLocalPlayerAsInitialized);
		this.registerPacket(AvailableActorIdentifiers);
		// this.registerPacket(PlayerSkin);
	}

	static registerPacket(packet) {
		this.#pool.set(packet.NETWORK_ID, packet);
	}

	static getPacket(id) {
		return this.#pool.has(id) ? new (this.#pool.get(id))() : null;
	}
}

module.exports = PacketPool;
