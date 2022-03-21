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

const LoginPacket = require("./LoginPacket");
const PlayStatusPacket = require("./PlayStatusPacket");
const ResourcePackClientResponsePacket = require("./ResourcePackClientResponsePacket");
const ResourcePacksInfoPacket = require("./ResourcePacksInfoPacket");
const ResourcePackStackPacket = require("./ResourcePackStackPacket");
const StartGamePacket = require("./StartGamePacket");
const CreativeContentPacket = require("./CreativeContentPacket");
const BiomeDefinitionListPacket = require("./BiomeDefinitionListPacket");
const TextPacket = require("./TextPacket");
const SetTitlePacket = require("./SetTitlePacket");
const DisconnectPacket = require("./DisconnectPacket");
const PlayerSkinPacket = require("./PlayerSkinPacket");
const SetLocalPlayerAsInitializedPacket = require("./SetLocalPlayerAsInitializedPacket");
const AvailableActorIdentifiersPacket = require("./AvailableActorIdentifiersPacket");

class PacketPool {

	static #pool = new Map();

	static init() {
		this.registerPacket(LoginPacket);
		this.registerPacket(PlayStatusPacket);
		this.registerPacket(ResourcePacksInfoPacket);
		this.registerPacket(ResourcePackClientResponsePacket);
		this.registerPacket(ResourcePackStackPacket);
		this.registerPacket(StartGamePacket);
		this.registerPacket(BiomeDefinitionListPacket);
		this.registerPacket(CreativeContentPacket);
		this.registerPacket(TextPacket);
		this.registerPacket(SetTitlePacket);
		this.registerPacket(DisconnectPacket);
		this.registerPacket(SetLocalPlayerAsInitializedPacket);
		// this.registerPacket(AvailableActorIdentifiersPacket);
		// this.registerPacket(PlayerSkinPacket);
	}

	static registerPacket(packet) {
		this.#pool.set(packet.NETWORK_ID, packet);
	}

	static getPacket(id) {
		return this.#pool.has(id) ? new (this.#pool.get(id))() : null;
	}
}

module.exports = PacketPool;
