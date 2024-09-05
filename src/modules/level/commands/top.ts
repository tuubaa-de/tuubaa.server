import {SlashInteraction} from "../../../types/commands";
import {topBuilder} from "..";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";
import {snowflake} from "../../../lib/snowflake";

export const topLevels = {
	data: new SlashCommandPermissionsBuilder()
		.setName("top")
		.setDescription("Zeigt die Top-Level an."),
	async execute(interaction: SlashInteraction) {
		if (interaction.channelId !== snowflake.channels.bot?.id) {
			await interaction.deferReply({ephemeral: true});
		} else {
			await interaction.deferReply({ephemeral: false});
		}
		const topData = await topBuilder(1, interaction);

		await interaction.editReply({
			embeds: [topData.embed],
			files: [topData.attachment],
			components: [topData.actionRow],
		});
	},
};
