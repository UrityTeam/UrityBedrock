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

class ToastRequestPacket extends DataPacket {
	static NETWORK_ID = Identifiers.TOAST_REQUEST_PACKET;

	settings = {
		title: "",
		body: ""
	};

	decodePayload() {
		this.settings.title = this.readString();
		this.settings.body = this.readString();
	}

	encodePayload() {
		this.writeString(this.settings.title);
		this.writeString(this.settings.body);
	}
}

module.exports = ToastRequestPacket;