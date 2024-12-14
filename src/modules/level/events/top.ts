
import {ActionRowBuilder, ButtonBuilder, ButtonStyle, Events,} from "discord.js";
import {client} from "../../../bot";
import {topBuilder} from "..";

export async function topInteration() {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;

		const data = interaction.customId.split(":");

		if (data[0] !== "top") {
			return;
		}

		const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setEmoji("⬅️")
				.setCustomId(`disabled`)
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true),
			new ButtonBuilder()
				.setEmoji("<a:loading:747680523459231834>")
				.setCustomId(`disabledloading`)
				.setStyle(ButtonStyle.Secondary),
			new ButtonBuilder()
				.setEmoji("➡️")
				.setCustomId("disabled2")
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true)
		);

		await interaction.message.edit({
			components: [actionRow],
		});
		// await interaction.deferUpdate();

		const topData = await topBuilder(parseInt(data[1]), interaction);

		await interaction.message.edit({
			embeds: [topData.embed],
			files: [topData.attachment],
			components: [topData.actionRow],
		});
	});

	// await interaction.update({
	//   embeds: [topData.embed],
	//   files: [topData.attachment],
	//   components: [topData.actionRow],
	// });

}
