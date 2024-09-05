import {CacheType, ChatInputCommandInteraction, SlashCommandSubcommandsOnlyBuilder,} from "discord.js";
import {SlashCommandPermissionsBuilder} from "../models/slashCommandBuilder";

export type Commands = {
	data:
		| SlashCommandPermissionsBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<
		SlashCommandPermissionsBuilder,
		"addSubcommand" | "addSubcommandGroup"
	>;
	execute: (
		interaction: ChatInputCommandInteraction<CacheType> | SlashInteraction
	) => Promise<void>;
};

export type SlashInteraction = ChatInputCommandInteraction<CacheType>;
