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

const PlayerNetworkSession = require("../network/mcpe/PlayerNetworkSession");
const ProtocolInfo = require("../network/mcpe/protocol/Identifiers");
const PlayStatusPacket = require("../network/mcpe/protocol/PlayStatusPacket");
const StartGamePacket = require("../network/mcpe/protocol/StartGamePacket");
const ResourcePackClientResponsePacket = require("../network/mcpe/protocol/ResourcePackClientResponsePacket");
const ResourcePackStackPacket = require("../network/mcpe/protocol/ResourcePackStackPacket");
const TextFormat = require("../utils/TextFormat");
const ResourcePacksInfoPacket = require("../network/mcpe/protocol/ResourcePacksInfoPacket");
const BiomeDefinitionListPacket = require("../network/mcpe/protocol/BiomeDefinitionListPacket");
const CreativeContentPacket = require("../network/mcpe/protocol/CreativeContentPacket");
const TextPacket = require("../network/mcpe/protocol/TextPacket");
const SetTitlePacket = require("../network/mcpe/protocol/SetTitlePacket");
const DisconnectPacket = require("../network/mcpe/protocol/DisconnectPacket");
const Config = require("../utils/Config");
const PlayerSkinPacket = require("../network/mcpe/protocol/PlayerSkinPacket");
const UUID = require("../utils/UUID");
const SkinAdapterSingleton = require("../network/mcpe/protocol/types/SkinAdapterSingleton");
const SkinImage = require("../network/mcpe/protocol/types/SkinImage");
const SkinAnimation = require("../network/mcpe/protocol/types/SkinAnimation");
const PersonaSkinPiece = require("../network/mcpe/protocol/types/PersonaSkinPiece");
const PersonaPieceTintColor = require("../network/mcpe/protocol/types/PersonaPieceTintColor");
const SkinData = require("../network/mcpe/protocol/types/SkinData");
const Entity = require("../entity/Entity");
const AvailableActorIdentifiersPacket = require("../network/mcpe/protocol/AvailableActorIdentifiersPacket");
const Utils = require("../utils/Utils");

class Player extends Entity {

	username = "";
	loggedIn = false;
	locale = "en_US";
	skin;
	uuid;
	address;
	networkSession;
	xuid;
	clientId;
	authorized;
	connection;

	constructor(server, connection) {
		super();
		this.server = server;
		this.address = connection.address;
		this.connection = connection;
		this.networkSession = new PlayerNetworkSession(this);
	}

	/**
	 * @return {PlayerNetworkSession}
	 */

	getNetworkSession() {
		return this.networkSession;
	}

	isConnected() {
		return this.networkSession !== null;
	}

	changeSkin(skin, oldSkinName, newSkinName) {
		if (!skin.isValid()) {
			return;
		}

		this.setSkin(skin);
		this.sendSkin();
	}

	sendSkin(targets_1 = null) {
		let targets = targets_1 === null ? this.server.getOnlinePlayers() : targets_1;
		let pk = new PlayerSkinPacket();
		pk.uuid = this.uuid;
		pk.skin = SkinAdapterSingleton.get().toSkinData(this.skin);
		this.server.broadcastPacket(targets, pk);
	}

	setSkin(skin) {
		skin.validate();
		this.skin = skin;
	}

	handleLogin(packet) {
		if (packet.protocol !== ProtocolInfo.CURRENT_PROTOCOL) {
			if (packet.protocol < ProtocolInfo.CURRENT_PROTOCOL) {
				this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_CLIENT, true);
			} else {
				this.sendPlayStatus(PlayStatusPacket.LOGIN_FAILED_SERVER, true);
			}

			this.close("Incompatible protocol");
			return;
		}

		this.username = TextFormat.clean(packet.username);
		this.clientId = packet.clientId;

		if (packet.locale !== null) {
			this.locale = packet.locale;
		}

		this.uuid = UUID.fromString(packet.clientUUID);

		/*let animations = [];

		packet.clientData["AnimatedImageData"].forEach(animation => {
			animations.push(new SkinAnimation(
				new SkinImage(
					animation["ImageHeight"],
					animation["ImageWidth"],
					Utils.base64_decode(animation["Image"], true)),
				animation["Type"],
				animation["Frames"],
				animation["AnimationExpression"]
			));
		});

		let personaPieces = [];

		packet.clientData["PersonaPieces"].forEach(piece => {
			personaPieces.push(new PersonaSkinPiece(
				piece["PieceId"],
				piece["PieceType"],
				piece["PackId"],
				piece["IsDefault"],
				piece["ProductId"]
			));
		});

		let pieceTintColors = [];

		packet.clientData["PieceTintColors"].forEach(tintColors => {
			pieceTintColors.push(new PersonaPieceTintColor(tintColors["PieceType"], tintColors["Colors"]));
		});

		let skinData = new SkinData(
			packet.clientData["SkinId"],
			packet.clientData["PlayFabId"],
			Utils.base64_decode(packet.clientData["SkinResourcePatch"] ? packet.clientData["SkinResourcePatch"] : "", true),
			new SkinImage(
				packet.clientData["SkinImageHeight"],
				packet.clientData["SkinImageWidth"],
				Utils.base64_decode(packet.clientData["SkinData"], true)
			),
			animations,
			new SkinImage(
				packet.clientData["CapeImageHeight"],
				packet.clientData["CapeImageWidth"],
				Utils.base64_decode(packet.clientData["CapeData"] ? packet.clientData["CapeData"] : "", true)
			),
			Utils.base64_decode(packet.clientData["SkinGeometryData"] ? packet.clientData["SkinGeometryData"] : "", true),
			Utils.base64_decode(packet.clientData["SkinGeometryDataEngineVersion"], true),
			Utils.base64_decode(packet.clientData["SkinAnimationData"] ? packet.clientData["SkinAnimationData"] : "", true),
			packet.clientData["CapeId"] ? packet.clientData["CapeId"] : "",
			null,
			packet.clientData["ArmSize"] ? packet.clientData["ArmSize"] : SkinData.ARM_SIZE_WIDE,
			packet.clientData["SkinColor"] ? packet.clientData["SkinColor"] : "",
			personaPieces,
			pieceTintColors,
			true,
			packet.clientData["PremiumSkin"] ? packet.clientData["PremiumSkin"] : false,
			packet.clientData["PersonaSkin"] ? packet.clientData["PersonaSkin"] : false,
			packet.clientData["CapeOnClassicSkin"] ? packet.clientData["CapeOnClassicSkin"] : false,
			true,
		);

		let skin;
		try {
			skin = SkinAdapterSingleton.get().fromSkinData(skinData);
			skin.validate();
		} catch (e) {
			console.log(e);
			this.close("Invalid Skin");
			return;
		}

		this.setSkin(skin);*/

		this.onVerifyCompleted(packet, null, true);
	}

	handleResourcePackClientResponse(packet) {
		switch (packet.status) {
			case ResourcePackClientResponsePacket.STATUS_REFUSED:
				this.close("You must accept resource packs to join this server.");
				break;

			case ResourcePackClientResponsePacket.STATUS_SEND_PACKS:
				break;

			case ResourcePackClientResponsePacket.STATUS_HAVE_ALL_PACKS:
				let resource_pack_stack_packet = new ResourcePackStackPacket();
				resource_pack_stack_packet.resourcePackStack = [];
				resource_pack_stack_packet.mustAccept = false;
				this.sendDataPacket(resource_pack_stack_packet);
				break;

			case ResourcePackClientResponsePacket.STATUS_COMPLETED:
				let start_game_packet = new StartGamePacket();
				start_game_packet.entityId = this.id;
				start_game_packet.entityRuntimeId = this.id;
				this.sendDataPacket(start_game_packet);

				this.sendDataPacket(new BiomeDefinitionListPacket());
				this.sendDataPacket(new AvailableActorIdentifiersPacket());
				this.sendDataPacket(new CreativeContentPacket());

				this.sendPlayStatus(PlayStatusPacket.PLAYER_SPAWN);
				break;
		}
		return true;
	}

	onVerifyCompleted(packet, error, signedByMojang) {
		if (error !== null) {
			this.close("Invalid session");
			return;
		}

		let xuid = packet.xuid;
		let cfg = new Config("BlueBird.json", Config.JSON);

		if (!signedByMojang && xuid !== "") {
			this.server.getLogger().info(this.username + " has an XUID, but their login keychain is not signed by Mojang");
			this.authorized = false;
			if (cfg.get("xbox-auth") === true) {
				this.server.getLogger().debug(this.username + " is not logged into Xbox Live");
				this.close("To join this server you must login to your xbox account");
				return;
			}
			xuid = "";
		}

		if (!this.username) {
			this.close("Username is required");
		}

		if (xuid === "" || !xuid instanceof String) {
			if (signedByMojang) {
				this.server.getLogger().warning(this.username + " tried to join without XUID");
				this.authorized = false;
				if (cfg.get("xbox-auth") === true) {
					this.close("To join this server you must login to your xbox account");
					return;
				}
			}
			this.server.getLogger().debug(this.username + " is not logged into Xbox Live");
		} else {
			this.authorized = true;
			this.server.getLogger().debug(this.username + " is logged into Xbox Live");
		}

		this.xuid = xuid;

		this.loggedIn = true;

		this.sendPlayStatus(PlayStatusPacket.LOGIN_SUCCESS);

		let packsInfo = new ResourcePacksInfoPacket();
		packsInfo.resourcePackEntries = [];
		packsInfo.mustAccept = false;
		packsInfo.forceServerPacks = false;
		this.sendDataPacket(packsInfo);

		this.server.getLogger().info("Player " + this.username + " joined the game");
		this.server.broadcastMessage("§ePlayer " + this.username + " joined the game");
	}

	handleText(packet) {
		if (packet.type === TextPacket.TYPE_CHAT) {
			let message = TextFormat.clean(packet.message);
			message = message.split("\n");
			for (let i in message) {
				let messageElement = message[i];
				if (messageElement.trim() !== "" && messageElement.length <= 255) {
					if (messageElement.startsWith("/")) {
						//TODO: Add player commands
						return false;
					}
					let msg = "<:player> :message".replace(":player", this.getName()).replace(":message", messageElement);
					this.server.broadcastMessage(msg);
					this.server.getLogger().info(msg);
				}
			}
			return true;
		}
	}

	sendMessage(message) {
		let pk = new TextPacket();
		pk.type = TextPacket.TYPE_RAW;
		pk.message = message;
		this.sendDataPacket(pk);
	}

	sendTitle(title, subtitle = "", fadeIn = -1, stay = -1, fadeOut = -1) {
		this.setTitleDuration(fadeIn, stay, fadeOut);
		if (subtitle !== "") {
			this.sendSubTitle(subtitle);
		}
		this.sendTitleText(title, SetTitlePacket.TYPE_SET_TITLE);
	}

	sendSubTitle(subtitle) {
		this.sendTitleText(subtitle, SetTitlePacket.TYPE_SET_SUBTITLE);
	}

	clearTitles() {
		let pk = new SetTitlePacket();
		pk.type = SetTitlePacket.TYPE_CLEAR_TITLE;
		this.sendDataPacket(pk);
	}

	resetTitles() {
		let pk = new SetTitlePacket();
		pk.type = SetTitlePacket.TYPE_RESET_TITLE;
		this.sendDataPacket(pk);
	}

	setTitleDuration(fadeIn, stay, fadeOut) {
		if (fadeIn >= 0 && stay >= 0 && fadeOut >= 0) {
			let pk = new SetTitlePacket();
			pk.type = SetTitlePacket.TYPE_SET_ANIMATION_TIMES;
			pk.fadeInTime = fadeIn;
			pk.stayTime = stay;
			pk.fadeOutTime = fadeOut;
			this.sendDataPacket(pk);
		}
	}

	sendTitleText(title, type) {
		let pk = new SetTitlePacket();
		pk.type = type;
		pk.text = title;
		this.sendDataPacket(pk);
	}

	sendPlayStatus(status, immediate = false) {
		let play_status_packet = new PlayStatusPacket();
		play_status_packet.status = status;
		this.sendDataPacket(play_status_packet, immediate);
	}

	close(reason, hide_disconnection_screen = false) {
		this.server.getLogger().info("Player " + this.username + " disconnected due to " + reason);
		this.server.broadcastMessage("§ePlayer " + this.username + " left the game");
		let pk = new DisconnectPacket();
		pk.hideDisconnectionScreen = hide_disconnection_screen;
		pk.message = reason;
		this.sendDataPacket(pk);
		this.connection.disconnect(reason);
	}

	getXuid() {
		return this.xuid;
	}

	getClientId() {
		return this.clientId;
	}

	isAuthorized() {
		return this.authorized;
	}

	getUUID() {
		return this.uuid;
	}

	getName() {
		return this.username;
	}

	sendDataPacket(packet, immediate = false) {
		if (!this.isConnected()) return false;

		if (!this.loggedIn && !packet.canBeSentBeforeLogin) {
			throw new Error("Attempted to send " + packet.getName() + " to " + this.getName() + " before they got logged in.");
		}

		this.server.raknet.queuePacket(this, packet, immediate);
	}
}

module.exports = Player;
