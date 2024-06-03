import {Events} from "discord.js";
import {client} from "../../../bot";
import {snowflake} from "../../../lib/snowflake";
import {prisma} from "../../../lib/database";

export async function greetMember() {
	client.on(Events.GuildMemberAdd, async (member) => {
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
