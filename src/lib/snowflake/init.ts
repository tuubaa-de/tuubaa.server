import {
  Channel,
  Guild,
  GuildBasedChannel,
  GuildChannel,
  GuildMember,
  Role,
} from "discord.js";
import { client } from "../../bot";
import { raw } from "@prisma/client/runtime/library";
import { Database, prisma } from "../database";

// TODO: need testing
class Snowflakes<T extends string> {
  roles: Record<T, Role | null> = {} as Record<T, Role | null>;
  channels: Record<T, GuildBasedChannel | null> = {} as Record<
    T,
    GuildBasedChannel | null
  >;
  members: Record<T, GuildMember | null> = {} as Record<T, GuildMember | null>;

  private rawRoles: T[];
  private rawChannels: T[];
  private rawMembers: T[];

  guild: Guild = {} as Guild;

  constructor(data: { roles: T[]; channels: T[]; members: T[] }) {
    this.rawRoles = data.roles;
    this.rawChannels = data.channels;
    this.rawMembers = data.members;
  }

  async load() {
    // TODO: remove id
    const guildId =
      (await Database.config.get("guild")) || "1066465107200188417";

    if (!guildId) {
      throw new Error("Guild ID not found in Config");
    }

    this.guild = client.guilds.cache.get(guildId)!;

    if (!this.guild) {
      throw new Error(`Guild not found with the id ${guildId}`);
    }

    this.roles = {} as Record<T, Role>;

    this.rawRoles.forEach(async (roleName) => {
      const roleId = await Database.config.get(roleName);
      const role = this.guild.roles.cache.get(roleId) || null;
      this.roles[roleName] = role;
    });

    if (!this.roles) {
      throw new Error("No Roles in Config found?");
    }

    this.rawChannels.forEach(async (channelName) => {
      const channelId = await Database.config.get(channelName);
      const channel = this.guild.channels.cache.get(channelId) || null;
      this.channels[channelName] = channel;
    });

    if (!this.channels) {
      throw new Error("No Channels in Config found?");
    }

    this.rawMembers.forEach(async (memberName) => {
      const memberId = await Database.config.get(memberName);
      const member = this.guild.members.cache.get(memberId) || null;
      this.members[memberName] = member;
    });

    if (!this.members) {
      throw new Error("No Members in Config found?");
    }
  }
}

export const snowflake = new Snowflakes({
  roles: ["admin", "mod", "user"],
  channels: ["general", "log", "mod", "admin"],
  members: ["tuubaa", "time"],
});
