import { Top } from "canvafy";
import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { LevelDatabase } from "../database";
import { topBuilder } from "..";

export const topLevels = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Zeigt die Top-Level an."),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply();

    const topData = await topBuilder(1, interaction);

    await interaction.editReply({
      embeds: [topData.embed],
      files: [topData.attachment],
      components: [topData.actionRow],
    });
  },
};
