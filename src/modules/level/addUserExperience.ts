import {GuildMember, Role} from "discord.js";
import {snowflake} from "../../lib/snowflake";
import {LevelDatabase} from "./database";
import {sendLevelMessage} from ".";
import {calcLevel, xpToNextLevel} from "./levelHelper";

/**
 * Add XP to a user and update their level if they have levelled up
 * @param user the user to add XP to
 * @param addedExperience the amount of XP to add, must be greater than 0
 */
export async function addUserExperience(
	user: GuildMember,
	addedExperience: number
) {
	if (!user || addedExperience <= 0) return;

	addedExperience = Math.floor(addedExperience);

	const levelRole: { [level: number]: Role | null } = {
		0: snowflake.roles.levellingRole1,
		20: snowflake.roles.levellingRole2,
		40: snowflake.roles.levellingRole3,
		60: snowflake.roles.levellingRole4,
		80: snowflake.roles.levellingRole5,
		100: snowflake.roles.levellingRole6,
	};

	const levelData = await LevelDatabase.getXP(user.id);

	const previousXP = levelData?.dezixp || 0;
	const previousLevel = calcLevel(previousXP);
	const newXP = previousXP + addedExperience;
	const newLevel = calcLevel(newXP);
	const levelUpXP = xpToNextLevel(previousXP);

	if (addedExperience >= levelUpXP) {
		const newRole = levelRole[newLevel];
		if (newRole) {
			for (const role of Object.values(levelRole)) {
				if (role) {
					await user.roles.remove(role.id);
				}
			}
			await user.roles.add(newRole.id);
		}
		await sendLevelMessage(user, newLevel, newRole);
	}
	await LevelDatabase.updateXP(user.id, newXP);
}
