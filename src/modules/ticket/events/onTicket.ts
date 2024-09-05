import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	EmbedBuilder,
	Events,
	PermissionFlagsBits,
} from "discord.js";
import {client} from "../../../bot";
import {TicketDatabase} from "../database";
import {snowflake} from "../../../lib/snowflake";

export async function onTicketCreate() {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isButton()) return;

		if (interaction.customId !== "ticket:create") {
			return;
		}

		await interaction.deferReply({ephemeral: true});

		const messageId = interaction.message.id;

		const ticketData = await TicketDatabase.getTicket(messageId);

		if (!ticketData) {
			await interaction.editReply(
				"Beim erstellen des Tickets ist ein Fehler aufgetreten. Melde dich bei einem Admin."
			);
			return;
		}

		const categoryId = ticketData.channelId;

		await interaction.guild?.channels.fetch();
		const category = interaction.guild?.channels.cache.get(
			categoryId
		) as CategoryChannel;

		if (!category) {
			await interaction.editReply(
				"Beim erstellen des Tickets ist ein Fehler aufgetreten. Melde dich bei einem Admin."
			);
			return;
		}

		console.log(snowflake.roles.team?.id);

		const channel = await interaction.guild?.channels.create({
			name: `┆₊˚「${ticketData.title}」・${interaction.user.displayName}`,
			parent: category,
			type: ChannelType.GuildText,
			permissionOverwrites: [
				{
					id: interaction.user.id,
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.AttachFiles,
					],
				},
				{
					id: snowflake.roles.team?.id || "1092209824508411914",
					allow: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.AttachFiles,
					],
				},
				{
					id: interaction.guild?.id!,
					deny: [
						PermissionFlagsBits.ViewChannel,
						PermissionFlagsBits.SendMessages,
						PermissionFlagsBits.AttachFiles,
					],
				},
			],
		});

		if (!channel) {
			await interaction.editReply(
				"Beim erstellen des Tickets ist ein Fehler aufgetreten. Melde dich bei einem Admin."
			);
			return;
		}

		const ping = (
			await channel.send(`${snowflake.roles.team || "<@795306274467348510>"}`)
		).delete();

		const embed = new EmbedBuilder()
			.setTitle(ticketData.title)
			.setAuthor({
				name: interaction.user.displayName,
				iconURL: interaction.user.displayAvatarURL(),
			})
			.setColor("#3498db")
			.setDescription("Das Team wird sich in Kürze um dich kümmern.")
			.setTimestamp(Date.now());

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel("Schließen")
				.setCustomId("ticket:close")
				.setStyle(ButtonStyle.Danger)
			// new ButtonBuilder()
			//   .setLabel("Claim")
			//   .setCustomId("ticket:claim")
			//   .setStyle(ButtonStyle.Primary)
		);

		await channel.send({embeds: [embed], components: [row]});

		await interaction.editReply(`Dein Ticket wurde unter ${channel} erstellt.`);
	});
}
