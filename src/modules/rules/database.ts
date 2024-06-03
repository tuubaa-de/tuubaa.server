import {Guild} from "discord.js";
import {prisma} from "../../lib/database";

export const RulesDatabase = {
	get,
	set,
};

async function get(guild: Guild) {
	return (
		(await prisma.rules.findUnique({
			where: {
				guild: guild.id,
			},
		})) || null
	);
}

async function set(guild: Guild, messageId: string, channeldId: string) {
	return (
		(await prisma.rules.upsert({
			create: {
				channel: channeldId,
				guild: guild.id,
				message: messageId,
			},
			update: {
				channel: channeldId,
				guild: messageId,
			},
			where: {
				guild: guild.id,
			},
		})) || null
	);
}
