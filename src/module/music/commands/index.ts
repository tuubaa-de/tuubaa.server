import { GuildMember, SlashCommandBuilder } from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { useMainPlayer } from "discord-player";

export const musicController = {
  data: new SlashCommandBuilder()
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
    ),
  async execute(interaction: SlashInteraction) {
    const member = interaction.member as GuildMember;
    switch (interaction.options.getSubcommand()) {
      case "play":
        const player = useMainPlayer();
        const channel = member.voice.channel;
        if (!channel) {
          interaction.reply("You are not connected to a voice channel!"); // make sure we have a voice channel
          return;
        }
        const query = interaction.options.getString("song", true); // we need input/query to play

        // let's defer the interaction as things can take time to process
        await interaction.deferReply();

        try {
          const { track } = await player.play(channel, query, {
            nodeOptions: {
              // nodeOptions are the options for guild node (aka your queue in simple word)
              metadata: interaction, // we can access this metadata object using queue.metadata later on
            },
          });

          interaction.followUp(`**${track.title}** enqueued!`);
          return;
        } catch (e) {
          // let's return error if something failed
          interaction.followUp(`Something went wrong: ${e}`);
          return;
        }

        break;
      case "skip":
        await interaction.reply("skip");
        break;
      case "pause":
        await interaction.reply("pause");
        break;
      case "resume":
        await interaction.reply("resume");
        break;
      case "queue":
        await interaction.reply("queue");
        break;
      case "stop":
        await interaction.reply("stop");
        break;
    }
  },
};
