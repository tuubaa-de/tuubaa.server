import { GuildMember } from "discord.js";
import { snowflake } from "../../lib/snowflake";
import { LevelDatabase } from "./database";
import { sendLevelMessage } from ".";

export async function addXP(user: GuildMember, xp: number) {
  const levelRole = {
    25: snowflake.roles.schuldig,
    50: snowflake.roles.verdaechtig,
    75: snowflake.roles.mitentfuehrer,
    100: snowflake.roles.beifahrer,
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
      const keyInt = parseInt(key);
      if (level >= keyInt && keyInt > highestRole) {
        highestRole = keyInt;
        currentRoleId = levelRole[keyInt as keyof typeof levelRole]?.id;
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
