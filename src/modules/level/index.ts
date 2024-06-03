import {
	ActionRowBuilder,
	AttachmentBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	Guild,
	GuildMember,
	Interaction, Role,
	User,
} from "discord.js";
import {Module} from "../../types/module";
import {LevelDatabase} from "./database";
import {initMessageXPEvaluator} from "./events/message";
import {snowflake} from "../../lib/snowflake";
import {myLevel} from "./commands/myLevel";
import {initXPVoiceEvaluator} from "./events/voice";
import {topLevels} from "./commands/top";
import {Top} from "canvafy";
import {topInteration} from "./events/top";
import {calcLevel} from "./levelHelper";

async function entry() {
	console.log(">> Level System loaded");

	initMessageXPEvaluator();
	initXPVoiceEvaluator();
	topInteration();
}

export const level = new Module({
	name: "level",
	commands: [myLevel, topLevels],
	entry: entry,
});

export async function sendLevelMessage(user: GuildMember | User, newLevel: number, newRole: Role | null) {
	const channel = snowflake.channels.bot;

	if (!channel) {
		return;
	}
	await channel.send(
		`GLÜCKWUNSCH ${user.displayName}! Du hast den ${newLevel}. Level erreicht${newRole ? `und die ${newRole.name}-Rolle erhalten` : ""}!`
	);
}

export async function topBuilder(site: number, interaction: Interaction) {
	const allLevelData = await LevelDatabase.getAllXP();

	const guild = interaction.guild as Guild;

	await interaction.guild?.members.fetch();

	const modifiedData = (
		await Promise.all(
			allLevelData.map(async (data, index) => {
				const user = interaction.guild?.members.cache.get(data.userId) || null;
				return {
					level: calcLevel(data.dezixp),
					xp: data.dezixp,
					user: user,
					top: index + 1,
				};
			})
		)
	).filter((data) => data.user != null);

	const link = "https://i.postimg.cc/7YK0SfsQ/image-2.png";

	const top = new Top()
		.setUsersData(
			modifiedData.slice(10 * (site - 1), 10 * site).map((data, index) => {
				return {
					top: data.top,
					avatar: data.user!.user.displayAvatarURL() || "",
					tag: data.user!.displayName,
					score: data.level,
				};
			})
		)
		.setScoreMessage("Level")
		.setBackground("image", link);

	const embed = new EmbedBuilder()
		.setTitle(`Rankeliste`)
		.setDescription(
			`**Seite ${site}**\n${interaction.user} ist auf Platz ${
				modifiedData.indexOf(
					modifiedData.find((data) => data.user!.id == interaction.user.id)!
				) + 1
			}`
		)
		.setFooter({
			text: interaction.user.displayName,
			iconURL: interaction.user.displayAvatarURL() || undefined,
		})
		.setImage("attachment://awesome.png");

	const attachment = new AttachmentBuilder(await top.build(), {
		description: "This is awesome",
		name: "awesome.png",
	});

	const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setEmoji("⬅️")
			.setCustomId(`top:${site - 1}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(site == 1),
		new ButtonBuilder()
			.setEmoji("➡️")
			.setCustomId(`top:${site + 1}`)
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(site * 10 >= modifiedData.length)
	);

	return {
		embed: embed,
		attachment: attachment,
		actionRow: actionRow,
	};
}
