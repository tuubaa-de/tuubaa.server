import {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export type Commands = {
	data:
		| Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
		| SlashCommandSubcommandsOnlyBuilder;
	execute: (
		interaction: ChatInputCommandInteraction<CacheType> | SlashInteraction
	) => Promise<void>;
};

export type SlashInteraction = ChatInputCommandInteraction<CacheType>;
