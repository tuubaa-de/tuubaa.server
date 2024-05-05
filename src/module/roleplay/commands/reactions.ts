import {
  APIInteractionDataResolvedGuildMember,
  APIInteractionGuildMember,
  Colors,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import axios from "axios";
import { snowflake } from "../../../lib/snowflake";

export const reaction = {
  data: new SlashCommandBuilder()
    .setName("roleplay")
    .setDescription("Benutze coole Roleplay Effekte")
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("kiss")
        .setDescription("Küsse jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du küssen möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("hug")
        .setDescription("Umarme jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du umarmen möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("slap")
        .setDescription("Schlage jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du schlagen möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("pat")
        .setDescription("Streichel jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du streicheln möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("bite")
        .setDescription("Beisse jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du beissen möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("lick")
        .setDescription("Lecke jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du lecken möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("cuddle")
        .setDescription("Kuschel mit jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du kuscheln möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("handhold")
        .setDescription("Halte jemanden die Hand")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User dem du die Hand halten möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("handshake")
        .setDescription("Gib jemanden die Hand")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User dem du die Hand geben möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("highfive")
        .setDescription("Gib jemanden ein Highfive")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User dem du ein Highfive geben möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("poke")
        .setDescription("Stupse jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du stupsen möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("punch")
        .setDescription("Boxe jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du boxen möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("tickle")
        .setDescription("Kitzle jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du kitzeln möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("wave")
        .setDescription("Winke jemanden zu")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User dem du zuwinken möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("smile")
        .setDescription("Lächle jemanden an")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User dem du anlächeln möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("wink")
        .setDescription("Zwinkere jemanden zu")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User dem du zuzwinkern möchtest")
            .setRequired(false)
        )
    )
    .addSubcommand((subbcommand) =>
      subbcommand
        .setName("scare")
        .setDescription("Erschrecke jemanden")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Der User den du erschrecken möchtest")
            .setRequired(false)
        )
    ),
  async execute(interaction: SlashInteraction) {
    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply({ ephemeral: false });

    if (interaction.channel != snowflake.channels.roleplay) {
      await interaction.deleteReply();
      await interaction.followUp({
        content: `Du kannst diesen Command nur im ${snowflake.channels.roleplay} Channel benutzen!`,
        ephemeral: true,
      });
      return;
    }

    let result = await axios.get(
      "https://api.otakugifs.xyz/gif?reaction=kiss&format=gif"
    );

    switch (interaction.options.getSubcommand()) {
      case "kiss":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=kiss&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Küssen",
              "Küsst",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "hug":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=hug&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Umarmung",
              "Umarmt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "slap":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=slap&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Schlag",
              "Schlägt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "pat":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=pat&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Streicheln",
              "Streichelt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "bite":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=bite&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Beissen",
              "Beisst",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "lick":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=lick&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Lecken",
              "Leckt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "cuddle":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=cuddle&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Kuscheln",
              "Kuschelt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "handhold":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=handhold&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Hand halten",
              "Hält die Hand von",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "handshake":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=handshake&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Hand geben",
              "Gibt die Hand von",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "highfive":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=highfive&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Highfive",
              "Gibt ein Highfive von",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "poke":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=poke&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Stups",
              "Stupst",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "punch":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=punch&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Boxen",
              "Boxt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });
        break;
      case "tickle":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=tickle&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Kitzeln",
              "Kitzelt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "wave":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=wave&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Winken",
              "Winkt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "smile":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=smile&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Lächeln",
              "Lächelt",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
      case "wink":
        result = await axios.get(
          "https://api.otakugifs.xyz/gif?reaction=wink&format=gif"
        );

        await interaction.editReply({
          embeds: [
            reactionEmbed(
              "Zwinkern",
              "Zwinkert",
              result.data.url,
              interaction.member as GuildMember,
              interaction.options.getMember("target")
            ),
          ],
        });

        break;
    }
  },
};

function reactionEmbed(
  title: string,
  reaction: string,
  gif: string,
  creator: GuildMember,
  target: GuildMember | null | APIInteractionDataResolvedGuildMember
) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(
      `${creator} ${reaction.toLowerCase()} ${target || "die Luft"}`
    )
    .setImage(gif)
    .setColor("Random")
    .setAuthor({
      name: creator.displayName,
      iconURL: creator.user.displayAvatarURL(),
    });
}
