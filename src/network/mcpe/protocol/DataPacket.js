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

const assert = require("assert");
const NetworkBinaryStream = require("../../NetworkBinaryStream");

class DataPacket extends NetworkBinaryStream {
	static NETWORK_ID = 0;

	isEncoded = false;
	canBeBatched = true;

	canBeSentBeforeLogin = false;

	mayHaveUnreadBytes = false;

	getName() {
		return this.constructor.name;
	}

	getId() {
		return this.constructor.NETWORK_ID;
	}

	decode() {
		this.offset = 0;
		this.decodeHeader();
		this.decodePayload();
	}

	decodeHeader() {
		assert(this.readVarInt() === this.getId());
	}

	decodePayload() {}

	encode() {
		this.reset();
		this.encodeHeader();
		this.encodePayload();
		this.isEncoded = true;
	}

	encodeHeader() {
		this.writeVarInt(this.getId());
	}

	encodePayload() {}

	clean() {
		this.isEncoded = false;
		this.reset();
	}

	sendTo(player, immediate = false) {
		if (!player.isConnected()) return;

		if (!player.loggedIn && !this.canBeSentBeforeLogin) {
			throw new Error(`Attempted to send ${this.getName()} to ${player.getNetworkSession().toString()} before he got logged in`);
		}

		player.server.raknet.queuePacket(player, this, immediate);
	}

	/**
	 * @param {PlayerNetworkSession} handle
	 */
	handle(handle) {
		return false;
	}
}

module.exports = DataPacket;
