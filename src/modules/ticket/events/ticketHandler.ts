import { Events } from "discord.js";
import { client } from "../../../bot";
import { prisma } from "../../../lib/database";

export async function ticketHandler() {
  client.on(Events.MessageCreate, async (message) => {
    const channel = await prisma.ticketChannel.findUnique({
      where: {
        channelId: message.channel.id,
      },
    });

    if (!channel) return;

    const ticketId = channel.ticketId;

    await prisma.ticketMessage.create({
      data: {
        message: message.content,
        ticketId: ticketId,
        messageId: message.id,
        timestamp: message.createdTimestamp,
        userId: message.author.id,
      },
    });
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId !== "ticket:close") return;

    await interaction.deferReply({ ephemeral: true });

    await interaction.editReply("Das Ticket wird geschlossen.");

    await interaction.channel?.delete("Ticket geschlossen");
  });
}
