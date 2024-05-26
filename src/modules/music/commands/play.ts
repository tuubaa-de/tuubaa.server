import {
  AttachmentBuilder,
  EmbedBuilder,
  GuildMember,
  TextBasedChannel,
} from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { client } from "../../../bot";
import { VoiceEmbedError } from "../embed";
import { Classic } from "musicard";
import { createMusicCard } from "..";

export async function play(interaction: SlashInteraction) {
  const member = interaction.member as GuildMember;
  const channel = interaction.channel as TextBasedChannel;

  if (!member.voice.channel) {
    await VoiceEmbedError(
      interaction,
      "Du musst in einem Sprachkanal sein, um Musik abzuspielen."
    );
    return;
  }

  if (!member.voice.channel.joinable) {
    await VoiceEmbedError(
      interaction,
      "Ich kann diesem Sprachkanal nicht beitreten."
    );
    return;
  }

  const query = interaction.options.getString("song")!;

  let player = client.player.players.get(interaction.guild!.id);

  if (!player) {
    player = client.player.players.create({
      guildId: interaction.guildId!,
      voiceChannel: member.voice.channel.id,
      textChannel: channel.id,
      autoPlay: false,
      volume: 40,
      autoLeave: false,
    });
    player.data["owner"] = member.id;
  }

  if (!player.connected) {
    player.queue.clear();
    player.connect({
      setDeaf: true,
      setMute: false,
    });
  }

  // const search_engine = interaction.options.getString("suchmaschine") || "youtube";

  const response = await client.player.search({
    query: query,
    source: "spotify",
    requester: interaction.user.id,
  });

  if (response.loadType === "error") {
    return interaction.editReply({
      content: `SYSTEM ERROR!!! ALLES BRICHT ZUSAMMEN!!! WAS HAST DU GETAN!!! Spaß, kann die Musik einfach nicht laden. 🤷`,
    });
  }

  if (response.loadType === "empty") {
    return interaction.editReply({
      content: `Habe keine Music gefunden 😞!`,
    });
  }

  const track = response.tracks[0];

  const musiccard = await createMusicCard(track);

  const attachment = new AttachmentBuilder(musiccard)
    .setName("musiccard.png")
    .setDescription("Music Card");

  const embed = (title: string, text: string) =>
    new EmbedBuilder()
      .setTitle(title)
      .setURL(track.url)
      .setDescription(text)
      .setColor("Blue")
      .setImage("attachment://musiccard.png")
      .setFooter({
        text: `Angefordert von ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setThumbnail("https://i.postimg.cc/JzgTDj97/oihoih.png");

  if (response.loadType === "playlist" && response.playlistInfo) {
    for (const track of response.tracks) {
      player.queue.add(track);
    }

    if (!player.playing) {
      await player.play();
    }

    return await interaction.editReply({
      embeds: [
        embed(
          "Playlist hinzugefügt",
          `Die Playlist **[${response.playlistInfo.name}](${track.url})** wurde zur Warteschlange hinzugefügt. 💕`
        ),
      ],
      files: [attachment],
    });
  }

  player.queue.add(response.tracks[0]);

  if (!player.playing) {
    await player.play();
  }

  await interaction.editReply({
    embeds: [
      embed(
        "Song hinzugefügt 🎶",
        `Der Song **[${track.title}](${track.url})** wurde zur Warteschlange hinzugefügt. 💕`
      ),
    ],
    files: [attachment],
  });
}
