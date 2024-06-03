import {GuildMember} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {client} from "../../../bot";
import {VoiceEmbedError, VoiceEmbedSuccess} from "../embed";

export async function clear(interaction: SlashInteraction) {
	const member = interaction.member as GuildMember;

	const player = client.player.players.get(interaction.guild!.id);

	if (!player || player?.connected === false) {
		return await VoiceEmbedError(interaction, "Es spielen keine Musik.");
	}

	if (player.data["owner"] !== member.id) {
		return await VoiceEmbedError(
			interaction,
			`Nur derjenige, der den Bot gestartet hat, kann die Wiedergabe löschen. Frage ${client.users.cache.get(
				player.data["owner"]
			)}.`
		);
	}

	player.queue.clear();

	return await VoiceEmbedSuccess(
		interaction,
		"Die Warteschlange wurde gelöscht."
	);
}
