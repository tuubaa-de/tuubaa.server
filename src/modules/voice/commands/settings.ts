import {SlashCommandBuilder} from "discord.js";
import {SlashInteraction} from "../../../types/commands";

export const voice = {
	data: new SlashCommandBuilder()
		.setName("voice")
		.setDescription("Ist der Bot ansprechbar?")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("limit")
				.setDescription("Ändere das User Limit vom Channel")
				.addNumberOption((option) =>
					option.setMaxValue(99).setMinValue(0).setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("kick")
				.setDescription("Verbanne den User aus deinem Voice Channel")
				.addUserOption((option) =>
					option
						.setName("target")
						.setDescription("Den User den du kicken möchtest!")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("name")
				.setDescription("Ändere den Namen des Voice Channel")
				.addStringOption((option) =>
					option.setName("Der Name vom Voice Channel")
				)
		),
	async execute(interaction: SlashInteraction) {
		//
	},
};
