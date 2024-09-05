import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	Colors,
	EmbedBuilder,
	Events,
	GuildMember,
	VoiceBasedChannel,
} from "discord.js";
import {client} from "../../../bot";
import {snowflake} from "../../../lib/snowflake";
import {VoiceDatabase} from "../database";
import {prisma} from "../../../lib/database";
import {voiceEmbed} from "../../../lib/embed";

let privateChannel = new Array<string>();

const accessRequest: {
	[key: string]: {
		user: GuildMember;
		owner: GuildMember;
		voice: VoiceBasedChannel;
	};
} = {};

export async function createVoice() {
	const voices = await VoiceDatabase.getAllVoiceChannels();

	voices.forEach(async (voice) => {
		if (!snowflake.guild.channels.cache.get(voice.voiceId)) {
			await prisma.voiceAccess.deleteMany({
				where: {
					voiceId: voice.voiceId,
				},
			});

			await prisma.voice.delete({
				where: {
					voiceId: voice.voiceId,
				},
			});
		}
	});

	privateChannel = (await VoiceDatabase.getAllVoiceChannels())
		.filter((x) => x.private)
		.map((x) => x.voiceId);

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) {
			return;
		}

		// console.log(interaction.customId);

		if (!["voice-access", "voice-deny"].includes(interaction.customId)) return;
		await interaction.deferReply({ephemeral: true});

		const message = interaction.message;

		if (interaction.customId == VoiceAction.DENY) {
			const accessRequestData = accessRequest[message.id];

			const user = accessRequestData.user;
			const channel = accessRequestData.voice;

			await message.delete();

			await channel.permissionOverwrites.create(user, {
				Connect: false,
			});
			return;
		}

		const accessRequestData = accessRequest[message.id];

		if (!accessRequestData) {
			await interaction.editReply(
				"Irgendwas ist schiefgelaufen bitte kontaktiere @Time"
			);
			throw new Error(`Something went wrong with ${message.id}/ VOICE/ ACCESS`);
		}
		const user = accessRequestData.user;
		const owner = accessRequestData.owner;
		const channel = accessRequestData.voice;

		await channel.permissionOverwrites.edit(user, {
			Connect: true,
		});

		await prisma.voice.update({
			where: {
				voiceId: channel.id,
			},
			data: {
				VoiceAccess: {
					create: {
						userId: user.id,
					},
				},
			},
			include: {
				VoiceAccess: true,
			},
		});

		await user.voice.setChannel(channel);

		(await channel.send(`user`)).delete();

		await channel.send({
			embeds: [
				voiceEmbed(
					`${user} du kannst nun in den ${channel} von ${owner} beitreten`
				),
			],
		});

		await interaction.editReply({
			embeds: [
				voiceEmbed(
					`${user} kan nun in den ${channel} von dir ${owner} beitreten`
				),
			],
		});
	});

	client.on(Events.VoiceStateUpdate, async (before, after) => {
		const voiceChannels = await VoiceDatabase.getAllVoiceChannels();

		if (
			before.channel &&
			voiceChannels.map((x) => x.voiceId).includes(before.channel.id)
		) {
			if (before.channel.members.size == 0) {
				await prisma.voiceAccess.deleteMany({
					where: {
						voiceId: before.channel.id,
					},
				});

				await prisma.voice.delete({
					where: {
						voiceId: before.channel.id,
					},
				});

				await before.channel.delete();
			}
			return;
		}

		if (!after.member || !after.channel) return;

		if (
			snowflake.channels.normal &&
			after.channel.id == snowflake.channels.normal.id
		) {
			createNormalChannel(after.member);
			return;
		}

		if (after.channelId == snowflake.channels.private) {
			createPrivateChannel(after.member);
			return;
		}

		if (privateChannel.includes(after.channel.id)) {
			const voice = await VoiceDatabase.getVoiceChannel(after.channel.id);

			if (voice?.VoiceAccess.map((x) => x.userId).includes(after.member.id)) {
				return;
			}

			const channelId = structuredClone(after.channel.id);
			const memberId = structuredClone(after.member.id);

			await after.channel.permissionOverwrites.create(after.member, {
				Connect: false,
			});

			await after.member!.voice.setChannel(
				snowflake.channels.waiting?.id || null
			);

			await sendAccessRequest(memberId, channelId);
		}
	});
}

async function createNormalChannel(user: GuildMember) {
	const userData = await VoiceDatabase.getUserConfig(user.id);

	const channel = await user.guild.channels.create({
		name:
			userData?.prefix.replace("{user}", user.displayName) ||
			`┆˚「🦃」${user.displayName}`,
		type: ChannelType.GuildVoice,
		parent: snowflake.channels.normal?.parentId,
		userLimit: userData?.limit || 0,
		permissionOverwrites: [
			{
				id: user.id,
				allow: ["Connect", "ManageChannels", "ViewChannel"],
			},
		],
	});

	await prisma.voice.create({
		data: {
			voiceId: channel.id,
			owner: user.id,
			private: false,
			locked: false,
		},
	});

	await user.voice.setChannel(channel);
}

async function createPrivateChannel(user: GuildMember) {
	const userData = await VoiceDatabase.getUserConfig(user.id);

	const channel = await user.guild.channels.create({
		name:
			userData?.prefix.replace("{user}", user.displayName) ||
			`┆˚「🔒」${user.displayName}`,
		type: ChannelType.GuildVoice,
		parent: snowflake.channels.private?.parentId,
		userLimit: userData?.limit || 0,
	});

	await prisma.voice.create({
		data: {
			voiceId: channel.id,
			owner: user.id,
			private: true,
			locked: false,
			VoiceAccess: {
				create: [
					{
						userId: user.id,
					},
				],
			},
		},
		include: {
			VoiceAccess: true,
		},
	});

	privateChannel.push(channel.id);

	await user.voice.setChannel(channel);
}

async function sendAccessRequest(userId: string, channelId: string) {
	const channel = snowflake.guild.channels.cache.get(
		channelId
	) as VoiceBasedChannel;
	const user = snowflake.guild.members.cache.get(userId);

	if (!channel || !user) {
		throw Error(
			`Didnt find channel ${channelId} and User ${userId} while sending message to voicechannel`
		);
	}

	const voiceData = await VoiceDatabase.getVoiceChannel(channelId);

	if (!voiceData) {
		console.log(await VoiceDatabase.getAllVoiceChannels());
		return;
	}

	const owner = await user.guild.members.fetch(voiceData.owner);

	const message = await channel.send({
		embeds: [accessEmbed(user, channel, owner)],
		components: [accessActionRow(user, channel)],
	});

	accessRequest[message.id] = {
		owner: owner,
		user: user,
		voice: channel,
	};
}

function accessEmbed(
	user: GuildMember,
	channel: VoiceBasedChannel,
	owner: GuildMember
) {
	return new EmbedBuilder()
		.setTitle("Voice Manager")
		.setDescription(`Darf ${user} deinen ${channel} betreten?`)
		.setColor(Colors.Blue)
		.setFooter({
			text: `${owner.displayName}`,
			iconURL: owner.user.displayAvatarURL(),
		});
}

function accessActionRow(user: GuildMember, channel: VoiceBasedChannel) {
	return new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setLabel("Akzeptieren")
			.setEmoji("✅")
			.setStyle(ButtonStyle.Success)
			.setCustomId(VoiceAction.ACCESS),
		new ButtonBuilder()
			.setLabel("Ablehnen")
			.setEmoji("❌")
			.setStyle(ButtonStyle.Danger)
			.setCustomId(VoiceAction.DENY)
	);
}

enum VoiceAction {
	ACCESS = "voice-access",
	DENY = "voice-deny",
}
