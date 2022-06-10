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

const Vector3 = require("../math/Vector3");

class Entity {

    static entityCount = 1;
    id;
    position;

    constructor() {
	this.id = Entity.nextRuntimeId();
	this.position = new Vector3(0, 5, 0);
    }
    
    static nextRuntimeId(){
        return Entity.entityCount++;
    }
}

module.exports = Entity;
