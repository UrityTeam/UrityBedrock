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

const TextFormat = require("./TextFormat");

class MainLogger {
	#debuggingLevel = 0;

	alert(message) {
		return this.log("ALERT", message, TextFormat.AQUA);
	}

	emergency(message) {
		return this.log("EMERGENCY", message, TextFormat.RED);
	}

	critical(message) {
		return this.log("CRITICAL", message, TextFormat.RED);
	}

	error(message) {
		return this.log("ERROR", message, TextFormat.DARK_RED);
	}

	warning(message) {
		return this.log("WARNING", message, TextFormat.YELLOW);
	}

	info(message) {
		return this.log("INFO", message, TextFormat.WHITE);
	}

	notice(message) {
		return this.log("NOTICE", message, TextFormat.BLUE);
	}

	debug(message) {
		if (this.#debuggingLevel < 1) return false;
		return this.log("DEBUG", message, TextFormat.GRAY);
	}

	debugExtensive(message) {
		if (this.#debuggingLevel < 2) return false;
		return this.log("DEBUG", message, TextFormat.GRAY);
	}

	log(type, message, color = TextFormat.GRAY) {
		color = TextFormat.toTerminal(color);
		message = TextFormat.toTerminal(message);
		let date = new Date();
		let timeString = date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
		console.log(TextFormat.toTerminal(TextFormat.BLUE) + "[" + timeString + "]" + TextFormat.toTerminal(TextFormat.RESET) + " " + color + type + " >", message + TextFormat.toTerminal(TextFormat.RESET));
	}

	setDebuggingLevel(level) {
		this.#debuggingLevel = level;
	}

	getDebuggingLevel() {
		return this.#debuggingLevel;
	}
}

module.exports = MainLogger;
