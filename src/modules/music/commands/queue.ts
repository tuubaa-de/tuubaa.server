import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	Colors,
	EmbedBuilder,
	GuildMember,
	time,
	TimestampStyles,
} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {client} from "../../../bot";
import {VoiceEmbedError} from "../embed";
import {MoonlinkTrack} from "moonlink.js";
import {createMusicCard} from "..";

export async function queue(interaction: SlashInteraction) {
	await createQueue(interaction);
}

export async function createQueue(interaction: SlashInteraction) {
	const member = interaction.member as GuildMember;
	const player = client.player.players.get(interaction.guild!.id);

	if (!player || player?.connected === false) {
		return await VoiceEmbedError(interaction, "Es spielen keine Musik.");
	}

	const queue = player.queue.getQueue();

	if (queue.length === 0 && !player.current) {
		return await VoiceEmbedError(interaction, "Die Warteschlange ist leer.");
	}

	const queueList = queue.map((track, index) => {
		return `${index + 1}. [${track.title}](${track.url})`;
	});

	queueList.splice(-(queueList.length - 9));

	const track: MoonlinkTrack = player.current as MoonlinkTrack;

	const musiccard = await createMusicCard(track);

	const playRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId("music:play")
			.setLabel("Play")
			.setEmoji("▶️")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("music:rewind")
			.setLabel("Back")
			.setEmoji("⏪")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("music:forward")
			.setLabel("Skip")
			.setEmoji("⏩")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("music:repeat")
			.setLabel("Repeat")
			.setEmoji("🔁")
			.setStyle(ButtonStyle.Primary),
		new ButtonBuilder()
			.setCustomId("music:clear")
			.setLabel("Clear")
			.setEmoji("🗑️")
			.setStyle(ButtonStyle.Primary)
	);

	const attachment = new AttachmentBuilder(musiccard)
		.setName("musiccard.png")
		.setDescription("Music Card");

	const embed = new EmbedBuilder()
		.setTitle("🎶 Warteschlange 🎶")
		.addFields({
			name: "Aktuell",
			value: `[${track.title}](${track.url}) <a:SpinTuba:1051099476829425684>`,
		})
		.addFields({
			name: `Nächstes Lied ${time(
				new Date(Date.now() + track.duration - track.position),
				TimestampStyles.RelativeTime
			)}: `,
			value:
				queueList.join("\n").substring(0, 1000) +
				`${queueList.length > 9 ? "\n\n[...]" : ""}` ||
				"Keine Lieder in der Warteschlange 💤.",
		})
		.setColor(Colors.Blue)
		.setImage("attachment://musiccard.png")
		.setThumbnail("https://i.postimg.cc/JzgTDj97/oihoih.png");

	return await interaction.editReply({
		embeds: [embed],
		files: [attachment],
		components: [playRow],
	});
}
