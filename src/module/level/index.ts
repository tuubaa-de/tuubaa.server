import { GuildMember, User } from "discord.js";
import { Module } from "../../types/module";
import { LevelDatabase } from "./database";
import { onMessage } from "./events/message";
import { snowflake } from "../../lib/snowflake";
import { myLevel } from "./commands";
import { onVoice } from "./events/voice";

async function entry() {
  console.log(">> Level System loaded");

  onMessage();
  onVoice();
}

export const level = new Module({
  name: "level",
  commands: [myLevel],
  entry: entry,
});

export async function addXP(user: GuildMember, xp: number) {
  const levelRole = {
    "10": snowflake.roles.admin,
    "20": snowflake.roles.mod,
    "30": snowflake.roles.user,
  };
  const levelData = await LevelDatabase.getLevel(user.id);

  let level = 0;
  let currentXP = 0;

  if (levelData) {
    level = levelData.level;
    currentXP = levelData.xp;
  }

  const newXP = currentXP + xp;

  const levelUpXP = (level + level + 1) * 20;

  if (newXP >= levelUpXP) {
    let currentRoleId = snowflake.roles.user?.id;
    let highestRole = 0;

    Object.keys(levelRole).forEach((key) => {
      if (level >= parseInt(key) && parseInt(key) > highestRole) {
        highestRole = parseInt(key);
        currentRoleId = levelRole[key as keyof typeof levelRole]?.id;
      }
    });

    if (currentRoleId) {
      await user.roles.add(currentRoleId);
    }

    await LevelDatabase.updateLevel(user.id, level + 1, newXP - levelUpXP);
    await sendLevelMessage(user);
    return true;
  }

  await LevelDatabase.updateLevel(user.id, level, newXP);
}

async function sendLevelMessage(user: GuildMember | User) {
  const levelData = await LevelDatabase.getLevel(user.id);

  const channel = snowflake.channels.bot;

  if (!channel || !levelData) {
    return;
  }
  await channel.send(
    `Congratulations ${user.displayName}! You are now level ${levelData.level}`
  );
}
