import { Events } from "discord.js";
import { client } from "../../../bot";
import { snowflake } from "../../../lib/snowflake";
import { addXP } from "../addXp";

export async function onVoice() {
  const currentUserInVoice: { [key: string]: VoiceMode } = {};
  setInterval(() => {
    Object.keys(currentUserInVoice).forEach((key) => {
      const user = snowflake.guild.members.cache.get(key);
      if (!user) {
        console.log(`User not found: ${key}`);
        return;
      }
      if (currentUserInVoice[key] == VoiceMode.FULL) {
        addXP(user, 2);
      } else if (currentUserInVoice[key] == VoiceMode.HALF) {
        addXP(user, 1);
      }
    });
  }, 60 * 1000);

  client.on(Events.VoiceStateUpdate, (before, after) => {
    if (before.member?.user.bot || after.member?.user.bot) {
      return;
    }

    if (after.channelId == null) {
      currentUserInVoice[after.id] = VoiceMode.ZERO;
      return;
    }
    if (after.channelId != null) {
      currentUserInVoice[before.id] = VoiceMode.FULL;
    }

    if (after.mute) {
      currentUserInVoice[after.id] = VoiceMode.HALF;
    }

    if (after.deaf) {
      currentUserInVoice[after.id] = VoiceMode.ZERO;
    }
  });
}

enum VoiceMode {
  FULL = "full",
  HALF = "half",
  ZERO = "zero",
}
