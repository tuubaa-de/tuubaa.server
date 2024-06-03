import {Colors, EmbedBuilder} from "discord.js";
import {SlashInteraction} from "../../types/commands";

export async function VoiceEmbedError(
	interaction: SlashInteraction,
	description: string
) {
	const embed = new EmbedBuilder()
		.setTitle("Voice Error")
		.setDescription(description)
		.setColor(Colors.Red);

	await interaction.editReply({embeds: [embed]});
}

export async function VoiceEmbedSuccess(
	interaction: SlashInteraction,
	description: string
) {
	const embed = new EmbedBuilder()
		.setTitle("Voice Success")
		.setDescription(description)
		.setColor(Colors.Blue);

	await interaction.editReply({embeds: [embed]});
}
