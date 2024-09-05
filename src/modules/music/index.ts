import {client} from "../../bot";
import {Module} from "../../types/module";
import {Events} from "discord.js";
import {musicController} from "./commands";
import {snowflake} from "../../lib/snowflake";
import {Classic} from "musicard";
import {MoonlinkTrack} from "moonlink.js";

async function entry() {
	console.log(">> Music System loaded");

	const player = client.player.players.get(snowflake.guild.id);
	player?.queue.clear();

	client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
		const player = client.player.players.get(
			oldState.guild.id || newState.guild.id
		);

		if (
			(oldState.channelId && oldState.channelId == player?.voiceChannel) ||
			(newState.channelId && newState.channelId === player?.voiceChannel)
		) {
			if (oldState.channel?.members.size == 1) {
				player?.destroy();
			}
		}
	});

	client.player.on("trackEnd", async (player, track) => {
		if (player.queue.size === 0) {
			// console.log("queue");
			setTimeout(async () => {
				// console.log(player.queue.size);
				// console.log(player.current);
				if (player.queue.size === 0 && !player.current) {
					await player.destroy();
				}
			}, 1000 * 15);
		}
	});
}

export const music = new Module({
	name: "music",
	commands: [musicController],
	entry: entry,
});

export async function createMusicCard(track: MoonlinkTrack) {
	const date = new Date(track.duration);

	const datePosition = new Date(track.position);

	return await Classic({
		thumbnailImage: track.artworkUrl,
		author: track.author,
		name: track.title,
		backgroundColor: "#313338",
		nameColor: "#349cdc",
		authorColor: "#349cdc",
		progressColor: "#349cdc",
		progressBarColor: "#4c5ad4",
		progress: Math.abs((track.position / track.duration) * 100),
		startTime: `${datePosition.getMinutes()}:${datePosition
			.getSeconds()
			.toString()
			.padStart(2, "0")}`,
		endTime: `${date.getMinutes()}:${date
			.getSeconds()
			.toString()
			.padStart(2, "0")}`,
	});
}
