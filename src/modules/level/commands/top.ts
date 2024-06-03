import {SlashInteraction} from "../../../types/commands";
import {topBuilder} from "..";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";

export const topLevels = {
	data: new SlashCommandPermissionsBuilder()
		.setName("top")
		.setDescription("Zeigt die Top-Level an."),
	async execute(interaction: SlashInteraction) {
		await interaction.deferReply();

		const topData = await topBuilder(1, interaction);

		await interaction.editReply({
			embeds: [topData.embed],
			files: [topData.attachment],
			components: [topData.actionRow],
		});
	},
};
