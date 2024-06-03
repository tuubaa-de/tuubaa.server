import {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { SlashCommandPermissionsBuilder } from "../models/slashCommandBuilder";

export type Commands = {
	data:
		| SlashCommandPermissionsBuilder
		| Omit<
		SlashCommandPermissionsBuilder,
		"addSubcommand" | "addSubcommandGroup"
	>
		| SlashCommandSubcommandsOnlyBuilder;
	execute: (
		interaction: ChatInputCommandInteraction<CacheType> | SlashInteraction
	) => Promise<void>;
};

export type SlashInteraction = ChatInputCommandInteraction<CacheType>;
