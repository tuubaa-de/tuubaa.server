import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { buildRoleEmbed } from "..";

export const createRoleEmbed = {
  data: new SlashCommandBuilder()
    .setName("role_explian_embed")
    .setDescription("Erstelle eine Embed Nachricht, die die Rollen erklärt.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const embed = await buildRoleEmbed();

    await interaction.channel?.send({ embeds: [embed] });

    await interaction.editReply("Erstellt!");
  },
};
