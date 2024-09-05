import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CategoryChannel,
	EmbedBuilder,
	Events,
	GuildTextBasedChannel,
} from "discord.js";
import {client} from "../../../bot";
import {TicketDatabase} from "../database";
import {emotes} from "../../../lib/utils";

export function createTicketModalHandler() {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isModalSubmit()) return;

		await interaction.deferReply({ephemeral: true});

		const data = interaction.customId.split(":");

		if (data[0] !== "ticket") return;

		if (data[1] !== "create") return;

		const channelId = data[2];

		await interaction.guild?.channels.fetch();

		let channel = interaction.guild!.channels.cache.get(
			channelId
		) as CategoryChannel;

		if (!channel) {
			channel = (interaction.channel as GuildTextBasedChannel)
				.parent as CategoryChannel;
		}

		// console.log(interaction.fields.fields);

		const title = interaction.fields.getTextInputValue("ticket:title");

		const description =
			interaction.fields.getTextInputValue("ticket:description");

		let buttonEmoji = interaction.fields.getField("ticket:button").value;

		if (!buttonEmoji) {
			buttonEmoji = "✉️";
		}

		const emote = emotes(buttonEmoji);

		if (emote == null) {
			await interaction.editReply(`**${buttonEmoji}** ist kein Emoji.`);
			return;
		}

		buttonEmoji = emote[0];

		const embed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(description)
			.setColor("#3498db");

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("ticket:create")
				.setLabel("Ticket erstellen")
				.setStyle(ButtonStyle.Primary)
				.setEmoji(buttonEmoji)
		);

		const message = await interaction.channel?.send({
			embeds: [embed],
			components: [row],
		});

		if (!message) {
			await interaction.editReply("Es ist ein Fehler aufgetreten.");
			return;
		}

		await TicketDatabase.createTicket({
			channelId: channel.id,
			messageId: message.id,
			title,
			description,
		});

		await interaction.editReply("Ticket wurde erstellt.");
	});
}
