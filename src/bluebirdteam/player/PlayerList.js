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

class PlayerList extends Map {
	/**
	 * @param ip_port {String}
	 * @param player {Player}
	 */
	addPlayer(ip_port, player) {
		this.set(ip_port, player);
	}

	/**
	 * @param ip_port {String}
	 * @returns {Player}
	 */
	getPlayer(ip_port) {
		return this.has(ip_port) ? this.get(ip_port) : null;
	}

	/**
	 * @param ip_port {String}
	 */
	hasPlayer(ip_port) {
		return Array.from(this.values()).indexOf(ip_port) !== null;
	}

	/**
	 * @param ip_port {String}
	 */
	removePlayer(ip_port) {
		return this.delete(ip_port);
	}
}

module.exports = PlayerList;
