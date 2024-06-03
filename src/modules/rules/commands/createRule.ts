import {
	CacheType,
	ChatInputCommandInteraction,
	Guild,
	PermissionFlagsBits,
	SlashCommandBuilder,
	TextBasedChannel,
} from "discord.js";
import {RulesDatabase} from "../database";
import {rulePrompt} from "../events/createRuleHandler";

export const createRule = {
	data: new SlashCommandBuilder()
		.setName("create_rule")
		.setDescription(
			"Erstellt die Regel! \nWenn du die Regel updates lösche bitte die alte Regel Nachricht"
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction: ChatInputCommandInteraction<CacheType>) {
		// await interaction.deferReply({ ephemeral: true }

		const guild = interaction.guild as Guild;

		const oldRuleMessage = await RulesDatabase.get(guild);

		if (oldRuleMessage?.channel) {
			const channel = guild.channels.cache.get(
				oldRuleMessage.channel
			) as TextBasedChannel;

			if (oldRuleMessage && channel) {
				const message = await channel.messages.fetch(oldRuleMessage.message);
				if (message) {
					await message.delete();
				}
			}
		}

		const modal = rulePrompt();

		await interaction.showModal(modal);
	},
};
