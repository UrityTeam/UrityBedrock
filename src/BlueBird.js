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

const Info = require("./Info");
const Path = require("path");
const Server = require("./Server");
const readline = require("readline");
const Textformat = require("./utils/TextFormat");

class BlueBird {
	server;

	constructor() {
		let path = {
			file: Path.normalize(__dirname + "/"),
			data: Path.normalize(__dirname + "/../")
		};
		this.server = new Server(path, Info.SOFTWARE_NAME, Info.SOFTWARE_VERSION);
	}
}

module.exports = BlueBird;
