import { GuildMember } from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { client } from "../../../bot";
import { snowflake } from "../../../lib/snowflake";
import { VoiceEmbedError, VoiceEmbedSuccess } from "../embed";

export async function pause(interaction: SlashInteraction) {
  const member = interaction.member as GuildMember;
  const player = client.player.players.get(interaction.guild!.id);

  if (!player || player?.connected === false) {
    return await VoiceEmbedError(interaction, "Es spielen keine Musik.");
  }

  const owner = player.data["owner"];

  if (owner !== member.id) {
    return await VoiceEmbedError(
      interaction,
      `Nur derjenige, der den Bot gestartet hat, kann die Wiedergabe pausieren. Frage ${client.users.cache.get(
        owner
      )}.`
    );
  }

  if (player.paused) {
    return await VoiceEmbedError(
      interaction,
      "Die Wiedergabe ist bereits pausiert. Nutze /resume, um fortzufahren."
    );
  }

  player.pause();

  return await VoiceEmbedSuccess(
    interaction,
    "Die Wiedergabe wurde pausiert. Nutze /resume, um fortzufahren."
  );
}
