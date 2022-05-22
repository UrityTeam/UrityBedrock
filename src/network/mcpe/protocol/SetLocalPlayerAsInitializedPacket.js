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

const DataPacket = require("./DataPacket");
const Identifiers = require("./Identifiers");

class SetLocalPlayerAsInitializedPacket extends DataPacket {
	static NETWORK_ID = Identifiers.SET_LOCAL_PLAYER_AS_INITIALIZED_PACKET;

	entityRuntimeId;

	decodePayload() {
		this.entityRuntimeId = this.readVarLong();
	}

	encodePayload() {
		this.writeVarLong(this.entityRuntimeId);
	}
}

module.exports = SetLocalPlayerAsInitializedPacket;