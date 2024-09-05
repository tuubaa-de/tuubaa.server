import {
	ActionRowBuilder,
	ButtonStyle,
	CacheType,
	Colors,
	EmbedBuilder,
	Events,
	Guild,
	Interaction,
	ModalBuilder,
	PermissionFlagsBits,
	TextInputBuilder,
	TextInputStyle,
} from "discord.js";
import {RulesDatabase} from "../database";
import {succesEmbed} from "../../../lib/embed";
import {snowflake} from "../../../lib/snowflake";
import {client} from "../../../bot";

export function onModalSubmit() {
	client.on(
		Events.InteractionCreate,
		async (interaction: Interaction<CacheType>) => {
			if (!interaction.isModalSubmit() || !interaction.channel) return;

			if (interaction.customId != "rules_modal") return;

			const guild = interaction.guild as Guild;

			const text = interaction.fields.getTextInputValue("rules_text_input");

			const newRules = await interaction.channel.send({
				embeds: [await ruleEmbed(text)],
			});

			if (!newRules) return;

			await RulesDatabase.set(guild, newRules.id, interaction.channel.id);

			await interaction.editReply({
				embeds: [succesEmbed("Erfolgreich die Regel erstellt!")],
			});
		}
	);
}

export function rulePrompt() {
	const modal = new ModalBuilder()
		.setCustomId("rules_modal")
		.setTitle("Rules Builder");

	const textInput = new TextInputBuilder()
		.setCustomId("rules_text_input")
		.setLabel("Gib den Rules Text ein")
		.setStyle(TextInputStyle.Paragraph)
		.setPlaceholder(
			"$1 Abboniere Tuba\n$2 Der Spurenassistens ist der beste Bot\n$3 Time ist der beste Dev ^^"
		)
		// .setValue()
		.setRequired(false)
		.setMaxLength(4000);

	modal.addComponents(
		new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
	);

	return modal;
}

const default_text = `
**§1** Verhalte dich jederzeit nett und respektvoll gegenüber allen
Nutzern, dazu zählt das Unterlassen von provokativen, rassistischen und sexistischen Nachrichten und Aussagen. Halte dich an die Terms of Service von Discord.

**§2** Jede Art von Beleidigung und radikalen Aussagen wird nicht toleriert.

**§3** Beleidigungen, Provokationen und extreme Aussagen sind in Name, Profilbild und Status zu untersagen und müssen bei einem Hinweis von Team sofort geändert werden. Gleiches gilt für das Nachahmen von Personen. Es sollte erkennbar sein, wer wer ist.

**§4** Das Stören von Gesprächen mit lauten Geräuschen, Stimmverzerrer, Soundboard etc. ist nicht erlaubt.

**§5** Das Teilen von NSFW-Inhalten u.ä. ist verboten.



**§7** Das Ausnutzen des Supports ist verboten.

**§8** Das Betteln nach Rängen etc. ist verboten.

**§9** Dem Team ist Folge zu leisten und ihre Anweisungen müssen sofort vollzogen werden, in Zweifelsfällen, entscheiden sie über dem Regelwerk.

**§10** Das Promoten von YouTube/Twitch… channel ist verboten

`;

export async function ruleEmbed(text: string | null = null) {
	const rules = text?.replace(/(§\d+)/g, "**$1**") || default_text;

	return new EmbedBuilder()

		.setTitle("Regelwerk")
		.setColor(Colors.DarkRed)
		.setDescription(rules)
		.setFooter({
			text: snowflake.members.tuubaa?.displayName || "tuubaa",
			iconURL: snowflake.members.tuubaa?.displayAvatarURL() || "",
		});
}
