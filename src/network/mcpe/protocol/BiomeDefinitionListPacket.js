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

class BiomeDefinitionListPacket extends DataPacket {
	static NETWORK_ID = Identifiers.BIOME_DEFINITION_LIST_PACKET;

	static HARDCODED_NBT_BLOB = "";

	canBeSentBeforeLogin = true;

	/** @type {Buffer} */
	namedtag;

	decodePayload() {
		this.namedtag = this.readRemaining();
	}

	encodePayload() {
		this.write(this.namedtag ? this.namedtag : Buffer.from(BiomeDefinitionListPacket.HARDCODED_NBT_BLOB, 'base64'));
	}
}

module.exports = BiomeDefinitionListPacket;
