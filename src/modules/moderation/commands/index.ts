import {EmbedBuilder, GuildMember} from "discord.js";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";
import {SlashInteraction} from "../../../types/commands";
import {snowflake} from "../../../lib/snowflake";
import {prisma} from "../../../lib/database";

const ban = {
	data: new SlashCommandPermissionsBuilder()
		.setName("ban")
		.setDMPermission(false)
		.setPermissionLevel("MOD_AND_HIGHER")
		.setDescription("Entlasse das Kind")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Der zu bannende User")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Warum wird er gebannt?")
				.setRequired(true)
		)
		.addAttachmentOption((option) =>
			option
				.setName("proof")
				.setDescription("Beweis für den Bann")
				.setRequired(false)
		),
	async execute(interaction: SlashInteraction) {
		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason", true);
		const proof = interaction.options.getAttachment("proof");
		const member = interaction.member as GuildMember;

		const targetMember = snowflake.getMember(user.id);

		if (!targetMember) {
			await interaction.editReply("Dieser User ist nicht auf dem Server");
			return;
		}

		if (member.roles.highest.position <= targetMember.roles.highest.position) {
			await interaction.editReply(
				"Dieser User hat eine höhere oder gleiche Rolle wie du, du kannst ihn nicht bannen"
			);
			return;
		}

		if (targetMember.bannable) {
			await interaction.editReply(
				"Dieser User kann nicht von mir gebannt werden"
			);
			return;
		}

		await targetMember.ban({reason: reason});

		await interaction.editReply(`Der User ${user.tag} wurde gebannt`);

		// TODO: PLEASE LOG
	},
};

const warn = {
	data: new SlashCommandPermissionsBuilder()
		.setName("warn")
		.setDMPermission(false)
		.setPermissionLevel("MOD_AND_HIGHER")
		.setDescription("Verwarne das Kind")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Der zu verwarnende User")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Warum wird er verwarnt?")
				.setRequired(true)
		)
		.addAttachmentOption((option) =>
			option
				.setName("proof")
				.setDescription("Beweis für die Verwarnung")
				.setRequired(false)
		),
	async execute(interaction: SlashInteraction) {
		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason", true);
		const proof = interaction.options.getAttachment("proof");

		const targetMember = snowflake.getMember(user.id);

		const member = interaction.member as GuildMember;

		if (!targetMember) {
			await interaction.editReply("Dieser User ist nicht auf dem Server");
			return;
		}

		if (snowflake.roles.team) {
			if (
				targetMember.roles.cache
					.map((role) => role.id)
					.includes(snowflake.roles.team.id)
			) {
				await interaction.editReply(
					"Dieser User ist ein Teammitglied, du kannst ihn nicht verwarnen"
				);
				return;
			}
		}

		if (targetMember.roles.highest.position >= member.roles.highest.position) {
			await interaction.editReply(
				"Dieser User hat eine höhere oder gleiche Rolle wie du, du kannst ihn nicht verwarnen"
			);
			return;
		}

		const data = await prisma.warnings.upsert({
			where: {
				userId: user.id,
			},
			update: {
				count: {
					increment: 1,
				},
			},
			create: {
				userId: user.id,
				count: 1,
				guild: interaction.guildId!,
			},
		});

		await interaction.editReply(`Der User ${user.tag} wurde verwarnt`);

		if (data.count >= 3) {
			await interaction.followUp(
				"Der User wurde gebannt, weil er 3 Verwarnungen hat"
			);

			if (!snowflake.roles.ban) {
				await targetMember.ban({reason: "3 Verwarnungen"});
				return;
			}
			await targetMember.roles.add(snowflake.roles.ban?.id || "");
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle("⚠️ VERWARNUNG ⚠️")
			.setColor("Red")
			.setDescription(
				`${user}, du wurdest verwarnt!\nBei 3 Verwarnungen wirst du gebannt!`
			)
			.addFields({
				name: "Verwahnungen",
				value: data.count.toString(),
			})
			.setAuthor({
				name: targetMember.user.displayName,
				iconURL: targetMember.user.displayAvatarURL(),
			})
			.setFooter({
				text: `von ${interaction.user.displayName} ausgeführt`,
				iconURL: interaction.user.displayAvatarURL(),
			});

		const dmMessage = await targetMember.send({embeds: [embed]});

		await (await snowflake.channels.bot?.send(`${user}`))?.delete();

		await snowflake.channels.bot?.send({
			embeds: [embed],
		});

		// TODO: PLEASE LOG
	},
};

const timeout = {
	data: new SlashCommandPermissionsBuilder()
		.setName("timeout")
		.setDescription("Gib dem Kind eine Auszeit")
		.setPermissionLevel("MOD_AND_HIGHER")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Der zu timeoutende User")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Warum wird er getimeoutet?")
				.setRequired(true)
		)
		.addIntegerOption((option) =>
			option
				.setName("tage")
				.setDescription("Wie viele Tage soll der Timeout dauern?")
				.setRequired(false)
		)
		.addIntegerOption((option) =>
			option
				.setName("stunden")
				.setDescription("Wie viele Stunden soll der Timeout dauern?")
				.setRequired(false)
		)
		.addIntegerOption((option) =>
			option
				.setName("minuten")
				.setDescription("Wie viele Minuten soll der Timeout dauern?")
				.setRequired(false)
		)
		.addIntegerOption((option) =>
			option
				.setName("sekunden")
				.setDescription("Wie viele Sekunden soll der Timeout dauern?")
				.setRequired(false)
		)
		.addAttachmentOption((option) =>
			option
				.setName("proof")
				.setDescription("Beweis für den Timeout")
				.setRequired(false)
		),
	async execute(interaction: SlashInteraction) {
		await interaction.deferReply({ephemeral: true});

		const user = interaction.options.getUser("user", true);
		const reason = interaction.options.getString("reason", true);

		const days = interaction.options.getInteger("tage");
		const hours = interaction.options.getInteger("stunden");
		const minutes = interaction.options.getInteger("minuten");
		const seconds = interaction.options.getInteger("sekunden");

		const proof = interaction.options.getAttachment("proof");

		const member = interaction.member as GuildMember;

		const targetMember = snowflake.getMember(user.id);

		if (!targetMember) {
			await interaction.editReply("Dieser User ist nicht auf dem Server");
			return;
		}

		if (snowflake.roles.team) {
			if (
				targetMember.roles.cache
					.map((role) => role.id)
					.includes(snowflake.roles.team.id)
			) {
				await interaction.editReply(
					"Dieser User ist ein Teammitglied, du kannst ihn nicht verwarnen"
				);
				return;
			}
		}

		if (member.roles.highest.position <= targetMember.roles.highest.position) {
			await interaction.editReply(
				"Dieser User hat eine höhere oder gleiche Rolle wie du, du kannst ihn nicht timeouten"
			);
			return;
		}

		await targetMember.timeout(
			1000 * (seconds || 0) +
			1000 * 60 * (minutes || 0) +
			1000 * 60 * 60 * (hours || 0) +
			1000 * 60 * 60 * 24 * (days || 0),
			reason
		);

		await interaction.editReply(
			`Der User ${user.tag} wurde getimeoutet für ${days || 0} Tage, ${
				hours || 0
			} Stunden, ${minutes || 0} Minuten und ${seconds || 0} Sekunden`
		);

		// TODO: PLEASE LOG
	},
};

export const moderationCommand = [warn, ban, timeout];
