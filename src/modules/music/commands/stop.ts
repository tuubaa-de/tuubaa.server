import {GuildMember} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {client} from "../../../bot";
import {VoiceEmbedError, VoiceEmbedSuccess} from "../embed";

export async function stop(interaction: SlashInteraction) {
	const member = interaction.member as GuildMember;

	const player = client.player.players.get(interaction.guild!.id);

	if (!player || player?.connected === false) {
		return await VoiceEmbedError(interaction, "Es spielen keine Musik.");
	}

	const owner = player.data["owner"];

	if (owner !== member.id) {
		return await VoiceEmbedError(
			interaction,
			`Nur derjenige, der den Bot gestartet hat, kann die Wiedergabe fortsetzen. Frage ${client.users.cache.get(
				owner
			)}.`
		);
	}

	await player.stop(true);
	player.queue.clear();
	await player.destroy();

	return await VoiceEmbedSuccess(interaction, "Die Wiedergabe wurde gestoppt.");
}
