import { SlashCommandBuilder } from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { uptime } from "../../../bot";
import moment = require("moment");

export const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ist der Bot ansprechbar?"),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply(
      `API: ${interaction.client.ws.ping}ms\nBot: ${
        Date.now() - interaction.createdTimestamp
      }ms\nUptime: ${moment(uptime).fromNow()}`
    );
  },
};
