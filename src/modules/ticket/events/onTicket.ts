import { Events } from "discord.js";
import { client } from "../../../bot";
import { TicketDatabase } from "../database";

async function onTicketCreate() {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId !== "ticket:create") return;

    const messageId = interaction.message.id;

    const ticketData = await TicketDatabase.getTicket(messageId);

    if (!ticketData) {
      await interaction.editReply(
        "Beim erstellen des Tickets ist ein Fehler aufgetreten. Melde dich bei einem Admin."
      );
      return;
    }

    const category = ticketData.channelId;

    await interaction.guild?.channels.fetch();
    const channel = interaction.guild?.channels.cache.get(category);
  });
}
