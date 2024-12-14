import {Events} from "discord.js";
import {client} from "../../../bot";
import {snowflake} from "../../../lib/snowflake";
import {prisma} from "../../../lib/database";

export async function greetMember() {

	const members = await snowflake.guild.members.fetch();

	let count = 0;
	let allCount = snowflake.guild.memberCount;

	for (const member of members.values()) {
		// if (snowflake.roles.teamSplitter) {
		// 	await member.roles.add(snowflake.roles.teamSplitter);
		// }

		if (member.user.bot) {
			allCount--;
			continue;
		}

		count++;
		allCount--;

		if (
			snowflake.roles.specialSplitter &&
			!member.roles.cache.get(snowflake.roles.specialSplitter?.id)
		) {
			await member.roles.add(snowflake.roles.specialSplitter);
		}

		if (
			snowflake.roles.personalySplitter &&
			!member.roles.cache.get(snowflake.roles.personalySplitter?.id)
		) {
			await member.roles.add(snowflake.roles.personalySplitter);
		}

		if (
			snowflake.roles.pingsSplitter &&
			!member.roles.cache.get(snowflake.roles.pingsSplitter?.id)
		) {
			await member.roles.add(snowflake.roles.pingsSplitter);
		}

		if (
			snowflake.roles.levellingRole1 &&
			!member.roles.cache.get(snowflake.roles.levellingRole1?.id)
		) {
			await member.roles.add(snowflake.roles.levellingRole1);
			console.log(`${count}/${allCount} >> ${member.user.username}`);
		}
	}

	client.on(Events.GuildMemberAdd, async (member) => {
		// if (snowflake.roles.teamSplitter) {
		// 	await member.roles.add(snowflake.roles.teamSplitter);
		// }

		if (snowflake.roles.specialSplitter) {
			await member.roles.add(snowflake.roles.specialSplitter);
		}

		if (snowflake.roles.personalySplitter) {
			await member.roles.add(snowflake.roles.personalySplitter);
		}

		if (snowflake.roles.pingsSplitter) {
			await member.roles.add(snowflake.roles.pingsSplitter);
		}

		if (snowflake.roles.levellingRole1) {
			await member.roles.add(snowflake.roles.levellingRole1.id);
		}

		await snowflake.channels.general?.send(
			`Ein neuer gefanger im **goldenen Van**! Begrüßt ${member}! <:HeyTuba:1137369596496707624>`
		);

		const roles = await prisma.remberRole.findMany({
			where: {
				userId: member.id,
			},
		});

		for (const roleData of roles) {
			const role = member.guild.roles.cache.get(roleData.roleId);

			if (
				(role && role.permissions.has("Administrator")) ||
				!role?.editable ||
				!member.manageable
			) {
				continue;
			}

			await member.roles.add(roleData.roleId);
		}
	});

}
