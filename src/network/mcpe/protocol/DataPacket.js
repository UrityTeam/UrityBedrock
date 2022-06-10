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

const NetworkBinaryStream = require("../../NetworkBinaryStream");

class DataPacket extends NetworkBinaryStream {
	static NETWORK_ID = 0;

	static PID_MASK = 0x3ff;

	static SUBCLIENT_ID_MASK = 0x03;
	static SENDER_SUBCLIENT_ID_SHIFT = 10;
	static RECIPIENT_SUBCLIENT_ID_SHIFT = 12;

	isEncoded = false;
	senderSubId = 0;
	recipientSubId = 0;
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
		let header = this.readVarInt();
		let pid = header & DataPacket.PID_MASK;
		if (pid !== this.getId()) {
			throw new Error(`Expected ${this.getId()} for packet ID, got ${pid}`);
		}
		this.senderSubId = (header >> DataPacket.SENDER_SUBCLIENT_ID_SHIFT) & DataPacket.SUBCLIENT_ID_MASK;
		this.recipientSubId = (header >> DataPacket.RECIPIENT_SUBCLIENT_ID_SHIFT) & DataPacket.SUBCLIENT_ID_MASK;
	}

	decodePayload() {}

	encode() {
		this.reset();
		this.encodeHeader();
		this.encodePayload();
		this.isEncoded = true;
	}

	encodeHeader() {
		this.writeVarInt(this.getId() |
			(this.senderSubId << DataPacket.SENDER_SUBCLIENT_ID_SHIFT) |
			(this.recipientSubId << DataPacket.RECIPIENT_SUBCLIENT_ID_SHIFT)
		);
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
