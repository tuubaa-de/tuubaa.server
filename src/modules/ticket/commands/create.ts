import {
	ActionRowBuilder,
	ButtonStyle,
	CategoryChannel,
	ChannelType,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";

export const createTicket = {
	data: new SlashCommandPermissionsBuilder()
		.setName("ticket")
		.setDescription("Das Ticket System")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("Erstelle ein Ticket.")
				.addChannelOption((option) =>
					option
						.setName("where")
						.setDescription("Wo sollen die neuen Ticket erstellt werden")
						.addChannelTypes(ChannelType.GuildCategory)
						.setRequired(false)
				)
		),
	async execute(interaction: SlashInteraction) {
		const channel = interaction.options.getChannel("where") as CategoryChannel;

		const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setCustomId(`ticket:title`)
				.setPlaceholder("z.b Support Ticket")
				.setLabel("Ticket Name")
				.setRequired(true)
				.setStyle(TextInputStyle.Short)
		);

		const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setLabel("Beschreibung")
				.setCustomId(`ticket:description`)
				.setPlaceholder("z.b Klicke auf den Button um ein Ticket zu erstellen")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)
		);

		const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(
			new TextInputBuilder()
				.setLabel("Button Emoji")
				.setCustomId("ticket:button")
				.setPlaceholder("z.b ✉️")
				.setRequired(false)
				.setStyle(TextInputStyle.Short)
		);

		const modal = new ModalBuilder()
			.setTitle("Ticket erstellen")
			.setCustomId(`ticket:create:${channel.id}`)
			.addComponents(row, row2, row3);

		await interaction.showModal(modal);
	},
};
