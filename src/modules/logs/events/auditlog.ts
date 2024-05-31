import {
  AuditLogEvent,
  AuditLogOptionsType,
  EmbedBuilder,
  Events,
  GuildAuditLogs,
  GuildAuditLogsEntry,
  MessageType,
} from "discord.js";
import { client } from "../../../bot";

export function auditlog() {
  client.on(Events.MessageDelete, async (message) => {
    if (message.guild === null) return;

    if (message.author?.id == client.user?.id) return;

    const embed = new EmbedBuilder()
      .setTitle("Nachricht gelöscht")
      .addFields({
        name: `Kanal (${message.channel.id}[${message.channel.url}])`,
        value: `${message.channel}`,
      })
      .addFields({
        name: "Autor",
        value: `${message.author}`,
      })
      .addFields({
        name: "Nachricht",
        value: `${message.content} || "No Content"`,
      });
  });

  client.on(Events.GuildAuditLogEntryCreate, async (auditlog) => {
    // console.log(auditlog);

    if (auditlog.executorId === client.user?.id) return;

    const embed = new EmbedBuilder();

    // switch (auditlog.action) {
    //   case AuditLogEvent.MessageDelete:
    //     embed.setTitle("Nachricht gelöscht").addFields({
    //       // name: `Kanal (${auditlog.})`,

    //     })
    //     break;
    // }
  });
}
