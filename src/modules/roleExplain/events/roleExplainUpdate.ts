import {Events, TextBasedChannel} from "discord.js";
import {client} from "../../../bot";
import {compareLists} from "../../../lib/utils";
import {snowflake} from "../../../lib/snowflake";
import {prisma} from "../../../lib/database";
import {buildRoleEmbed} from "..";

export function roleExplainUpdate() {
	client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
		if (oldMember.roles.cache === newMember.roles.cache) {
			return;
		}

		const {removed, added} = compareLists(
			oldMember.roles.cache.map((r) => r.id),
			newMember.roles.cache.map((r) => r.id)
		);

		const allRoles = Array.from(new Set([...removed, ...added]));

		const teamRoles = [
			snowflake.roles.dev?.id,
			snowflake.roles.manager?.id,
			snowflake.roles.mod?.id,
			snowflake.roles.owner?.id,
		];

		if (!allRoles.every((element) => teamRoles.includes(element))) {
			// console.log(allRoles, teamRoles);
			return;
		}

		const messageData = await prisma.roleExplanation.findMany({
			where: {
				guildId: newMember.guild.id,
			},
		});

		if (messageData.length === 0) {
			return;
		}

		const messageId = messageData[0].messageId;
		const channel = newMember.guild.channels.cache.get(
			messageData[0].channelId
		) as TextBasedChannel | null;

		await channel?.messages.fetch();
		const message = channel?.messages.cache.get(messageId);

		if (!message) {
			await prisma.roleExplanation.delete({
				where: {
					messageId,
				},
			});
			return;
		}

		await message.edit({
			embeds: [await buildRoleEmbed()],
		});
	});
}
