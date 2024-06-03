import {SlashCommandBuilder} from "discord.js";
import {snowflake} from "../lib/snowflake";

export class SlashCommandPermissionsBuilder extends SlashCommandBuilder {
	constructor() {
		super();
	}

	permissionLevel: keyof typeof SlashCommandPermissionType = "USER";
	onlyCommandsChannel = false;

	setPermissionLevel(level: keyof typeof SlashCommandPermissionType) {
		this.permissionLevel = level;
		return this;
	}

	// explain
	/**
	 * Only will shown in the commands channel
	 * @param onlyCommandsChannel boolean
	 * @returns this
	 */
	setOnlyCommandsChannel(onlyCommandsChannel: boolean) {
		this.onlyCommandsChannel = onlyCommandsChannel;
		return this;
	}
}

export const SlashCommandPermissionType: {
	[key: string]: { level: number; role: keyof typeof snowflake.roles };
} = {
	USER: {
		level: 0,
		role: "user",
	},
	MOD: {
		level: 10,
		role: "mod",
	},
	MOD_AND_HIGHER: {
		level: 11,
		role: "mod",
	},
	DEV: {
		level: 100,
		role: "dev",
	},
	OWNER: {
		level: 1000,
		role: "owner",
	},
};
