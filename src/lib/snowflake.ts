import {Guild, GuildBasedChannel, GuildMember, GuildTextBasedChannel, Role, TextChannel,} from "discord.js";
import {client} from "../bot";
import {Database} from "./database";
import {publicProcedure, router} from "../endpoint";
import {z} from "zod";

const Roles = z.object({

	user: z.custom<Role>().nullable(),
	ban: z.custom<Role>().nullable(),
	mute: z.custom<Role>().nullable(),
	team: z.custom<Role>().nullable(),

	admin: z.custom<Role>().nullable(),

	owner: z.custom<Role>().nullable(),
	dev: z.custom<Role>().nullable(),
	manager: z.custom<Role>().nullable(),
	mod: z.custom<Role>().nullable(),
	emotes: z.custom<Role>().nullable(),

	upgrader: z.custom<Role>().nullable(),
	friend: z.custom<Role>().nullable(),
	youtube: z.custom<Role>().nullable(),
	artist: z.custom<Role>().nullable(),

	levellingRole1: z.custom<Role>().nullable(),
	levellingRole2: z.custom<Role>().nullable(),
	levellingRole3: z.custom<Role>().nullable(),
	levellingRole4: z.custom<Role>().nullable(),
	levellingRole5: z.custom<Role>().nullable(),
	levellingRole6: z.custom<Role>().nullable(),

	teamSplitter: z.custom<Role>().nullable(),
	specialSplitter: z.custom<Role>().nullable(),
	personalySplitter: z.custom<Role>().nullable(),
	pingsSplitter: z.custom<Role>().nullable(),

});

const Channels = z.object({
	memberCount: z.custom<TextChannel>().nullable(),
	general: z.custom<GuildTextBasedChannel>().nullable(),
	bot: z.custom<GuildTextBasedChannel>().nullable(),
	log: z.custom<GuildTextBasedChannel>().nullable(),
	mod: z.custom<GuildTextBasedChannel>().nullable(),
	normal: z.custom<GuildTextBasedChannel>().nullable(),
	private: z.custom<GuildTextBasedChannel>().nullable(),
	waiting: z.custom<GuildTextBasedChannel>().nullable(),
	rules: z.custom<GuildTextBasedChannel>().nullable(),
	introduce: z.custom<GuildTextBasedChannel>().nullable(),
	minecraft: z.custom<GuildTextBasedChannel>().nullable(),
	support: z.custom<GuildTextBasedChannel>().nullable(),
	welcome: z.custom<GuildTextBasedChannel>().nullable(),
});

const Members = z.object({
	time: z.custom<GuildMember>().nullable(),
	tuubaa: z.custom<GuildMember>().nullable(),
});

type Roles = z.infer<typeof Roles>;
type Channels = z.infer<typeof Channels>;
type Members = z.infer<typeof Members>;

class Snowflake {
	roles!: Roles;
	channels!: Channels;
	members!: Members;

	guild!: Guild;

	async updateRole(name: keyof Roles, id: string) {
		await Database.config.set(name, id);
		const role = this.guild.roles.cache.get(id);


    if (!role) {
      throw new Error(`Role not found with the id ${name} ${id}`);
    }


		this.roles[name] = role;
	}

	async getRole(roleId: string) {
		return this.guild.roles.cache.get(roleId);
	}

	async getChannel(channelId: string) {
		return this.guild.channels.cache.get(channelId);
	}

	getMember(memberId: string) {
		return this.guild.members.cache.get(memberId);
	}

	async updateChannel(name: keyof Channels, id: string) {
		await Database.config.set(name, id);
		const channel = this.guild.channels.cache.get(id);

		if (!channel) {
			throw new Error(`Channel not found with the id ${id}`);
		}


		this.channels[name] = channel as TextChannel;
	}

	async updateMember(name: keyof Members, id: string) {
		await Database.config.set(name, id);
		const member = this.guild.members.cache.get(id);

		if (!member) {
			throw new Error(`Member not found with the id ${id}`);
		}

		this.members[name] = member;
	}

	async load() {
		console.log("Loading Snowflake");
		const guildId =
			(await Database.config.get("guild")) || "1009761004214833213";

		if (!guildId) {
			throw new Error("Guild ID not found in Config");
		}

		this.guild = client.guilds.cache.get(guildId)!;

		if (!this.guild) {
			throw new Error(`Guild not found with the id ${guildId}`);
		}

		await this.guild.members.fetch();
		await this.guild.roles.fetch();
		await this.guild.channels.fetch();

		const rawRole = {} as Record<keyof Roles, Role | null>;
		const rawChannel = {} as Record<keyof Channels, GuildBasedChannel | null>;
		const rawMember = {} as Record<keyof Members, GuildMember | null>;

		for (const key in Roles.shape) {
			const roleId = await Database.config.get(key);
			const role = this.guild.roles.cache.get(roleId) || null;

			rawRole[key as keyof Roles] = role;
		}

		for (const key in Channels.shape) {
			const channelId = await Database.config.get(key);
			const channel = this.guild.channels.cache.get(channelId) || null;

			rawChannel[key as keyof Channels] = channel;
		}

		for (const key in Members.shape) {
			const memberId = await Database.config.get(key);
			const member = this.guild.members.cache.get(memberId) || null;

			rawMember[key as keyof Members] = member;
		}

		this.roles = Roles.parse(rawRole);
		this.channels = Channels.parse(rawChannel);
		this.members = Members.parse(rawMember);
	}
}

export const snowflake = new Snowflake();

export const snowflakeRouter = router({
	roles: publicProcedure.query(async (opts) => {
		let response = {} as Record<
			string,
			{ label: string; id: string; color: number } | null
		>;

		for (const key in snowflake.roles) {
			if (!snowflake.roles[key as keyof Roles]) {
				response[key] = null;
				continue;
			}
			response[key] = {
				label: snowflake.roles[key as keyof Roles]!.name,
				id: snowflake.roles[key as keyof Roles]!.id,
				color: snowflake.roles[key as keyof Roles]!.color,
			};
		}
		return response;
	}),
	allRoles: publicProcedure.query(async (opts) => {
		const lol = snowflake.guild.roles.cache.map((role) => ({
			label: role.name,
			id: role.id,
			color: role.color,
		}));
		return lol;
	}),
	updateRoles: publicProcedure
		.input(z.object({roleName: z.string(), roleId: z.string()}))
		.mutation(async (opts) => {
			const {input} = opts;
			await snowflake.updateRole(input.roleName as keyof Roles, input.roleId);
		}),
});
