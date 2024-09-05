import {GuildMember} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {play} from "./play";
import {skip} from "./skip";
import {pause} from "./pause";
import {resume} from "./resume";
import {queue} from "./queue";
import {stop} from "./stop";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";
import {snowflake} from "../../../lib/snowflake";

export const musicController = {
	data: new SlashCommandPermissionsBuilder()
		.setName("music")
		.setDescription("Ist der Bot ansprechbar?")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("play")
				.setDescription("Spiele Musik ab")
				.addStringOption((option) =>
					option
						.setName("song")
						.setDescription("Der Name des Songs")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("suchmaschine")
						.setDescription("Wo soll der Song gesucht werden?")
						.setRequired(false)
						.setChoices(
							{
								name: "YouTube",
								value: "youtube",
							},
							{
								name: "Spotify",
								value: "spotify",
							},
							{
								name: "SoundCloud",
								value: "soundcloud",
							}
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("skip")
				.setDescription("Überspringe den aktuellen Song")
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("pause").setDescription("Pausiere den aktuellen Song")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("resume")
				.setDescription("Setze den aktuellen Song fort")
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("queue").setDescription("Zeige die Warteschlange an")
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("stop").setDescription("Stoppe die Musik")
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("clear").setDescription("Lösche die Warteschlange")
		),
	async execute(interaction: SlashInteraction) {
		if (interaction.channelId !== snowflake.channels.bot?.id) {
			await interaction.deferReply({ephemeral: true});
		} else {
			await interaction.deferReply({ephemeral: false});
		}

		const member = interaction.member as GuildMember;

		switch (interaction.options.getSubcommand()) {
			case "play":
				play(interaction);
				break;
			case "skip":
				skip(interaction);
				break;
			case "pause":
				pause(interaction);
				break;
			case "resume":
				resume(interaction);
				break;
			case "queue":
				queue(interaction);
				break;
			case "stop":
				stop(interaction);
				break;
		}
	},
};
