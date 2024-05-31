import { Events } from "discord.js";
import { client } from "../../../bot";
import { prisma } from "../../../lib/database";
import { compareLists } from "../../../lib/utils";

export async function rememberRole() {
  client.on(Events.GuildMemberRemove, async (member) => {
    const roles = member.roles.cache.map((r) => r.id);

    for (const role of roles) {
      const data = await prisma.remberRole.findUnique({
        where: {
          roleId_userId: {
            roleId: role,
            userId: member.id,
          },
        },
      });

      if (!data) continue;

      await prisma.remberRole.delete({
        where: {
          roleId_userId: {
            roleId: role,
            userId: member.id,
          },
        },
      });
    }
  });

  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

    const { removed, added } = compareLists(
      oldMember.roles.cache.map((r) => r.id),
      newMember.roles.cache.map((r) => r.id)
    );

    for (const role of removed) {
      const data = await prisma.remberRole.findUnique({
        where: {
          roleId_userId: {
            roleId: role,
            userId: newMember.id,
          },
        },
      });

      if (!data) continue;

      await prisma.remberRole.delete({
        where: {
          roleId_userId: {
            roleId: role,
            userId: newMember.id,
          },
        },
      });
    }

    for (const role of added) {
      await prisma.remberRole.upsert({
        where: {
          roleId_userId: {
            roleId: role,
            userId: newMember.id,
          },
        },
        create: {
          guild: newMember.guild.id,
          roleId: role,
          userId: newMember.id,
        },
        update: {
          guild: newMember.guild.id,
          roleId: role,
          userId: newMember.id,
        },
      });
    }
  });
}
