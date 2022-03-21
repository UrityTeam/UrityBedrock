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
const fs = require("fs");
const BlueBird = require("../../../BlueBird");
const Utils = require("../../../utils/Utils");
const Path = require("path");

class AvailableActorIdentifiersPacket extends DataPacket {
	static NETWORK_ID = Identifiers.AVAILABLE_ACTOR_IDENTIFIERS_PACKET;

	/** @type {Buffer} */
	namedtag;

	decodePayload() {
		this.namedtag = this.readRemaining();
	}

	encodePayload() {
		let entity_identifiers = fs.readFileSync(Path.normalize(__dirname + "/../../../resources/entity_identifiers.nbt"));
		let content = Utils.base64_encode(entity_identifiers.toString("utf8"));
		this.write(this.namedtag ? this.namedtag : Buffer.from(content, "base64"));
	}
}

module.exports = AvailableActorIdentifiersPacket;
