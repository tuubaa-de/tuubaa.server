import {PermissionFlagsBits} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {uptime} from "../../../bot";
import {UtilDatabase} from "../database";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";
import moment = require("moment");

export const ping = {
	data: new SlashCommandPermissionsBuilder()
		.setName("ping")
		.setDescription("Ist der Bot ansprechbar?"),
	async execute(interaction: SlashInteraction) {
		await interaction.editReply(
			`API: ${interaction.client.ws.ping}ms\nBot: ${
				Date.now() - interaction.createdTimestamp
			}ms\nUptime: ${moment(uptime).fromNow()}`
		);
	},
};

export const keks = {
	data: new SlashCommandPermissionsBuilder()
		.setName("keks")
		.setDescription("Gib dir oder jemanden ein Keks.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Der User dem du ein Keks geben willst.")
		),
	async execute(interaction: SlashInteraction) {
		const user = interaction.options.getUser("user");

		if (user) {
			if (user.id == interaction.user.id) {
				await interaction.reply(
					"Traurig, dass du dir selbst ein Keks geben willst <:PepeTuba:1084100168745484308>!"
				);
				return;
			}
			await UtilDatabase.addKeks(user.id);

			await interaction.reply(
				`${user}, hier ein Keks von ${interaction.user}! :cookie:`
			);
			return;
		}

		await interaction.reply("Hier ein Keks! :cookie:");
	},
};

export const sayAsBot = {
	data: new SlashCommandPermissionsBuilder()
		.setName("say")
		.setDescription("Lass den Bot etwas sagen.")
		.addStringOption((option) =>
			option.setName("text").setDescription("Text").setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: SlashInteraction) {
		const message = await interaction.deferReply({ephemeral: true});

		await interaction.channel?.send(interaction.options.getString("text")!);

		await interaction.editReply("Gesendet!");

		await message.delete();
	},
};
