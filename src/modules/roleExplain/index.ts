import {Colors, Role} from "discord.js";
import {Module} from "../../types/module";
import {EmbedBuilder} from "@discordjs/builders";
import {snowflake} from "../../lib/snowflake";
import {createRoleEmbed} from "./commands/createRoleEmbed";
import {roleExplainUpdate} from "./events/roleExplainUpdate";

async function entry() {
	console.log(">> Role Explain Module Loaded");

	roleExplainUpdate();
}

export const roleExplain = new Module({
	commands: [createRoleEmbed],
	entry: entry,
	name: "Role Explain",
});

export async function buildRoleEmbed() {

	const purple = ":purple:";
	const blue = ":blue:";
	const yellow = ":yellow:";
	const green = ":green:";
	const pink = ":pink:";


	const getMember = (role: Role | null) => {
		return role?.members.map((member) => `- ${member}`).join("\n");
	};

	const fahrer = snowflake.roles.owner;
	const fahrerText =
		"gehört dem **Owner**, der euch von allen Gassen aufsammelt";
	const fahrerMembers = getMember(fahrer);

	const dev = snowflake.roles.dev;
	const devText =
		"gehört dem **Entwickler**, der diesen Van mit eigenen Füßen und Händen gebaut hat";
	const devMembers = getMember(dev);

	const manager = snowflake.roles.manager;
	const managerText =
		"gehört dem **Manager** der sich um denn Van und um die Wachhunde kümmert\n> Er erledigt die Nachtschicht wenn tuubaa schläft";
	const managerMembers = getMember(manager);

	const mod = snowflake.roles.mod;
	const modText =
		"gehört den **Moderatoren**, die aufpassen dass keiner diesen Van verlassen kann und keiner hier einbricht";
	const modMembers = getMember(mod);

	const emotes = snowflake.roles.emotes;
	const emotesText = "gehört den **Designern**, die die Emotes gemalt haben";
	const emotesMembers = getMember(emotes);

	const upgrader = snowflake.roles.upgrader;
	const upgraderText =
		"gehört den **Boostern**, die uns Ihr Geld spenden für bessere Reifen";
	const upgraderMembers = getMember(upgrader);

	const friend = snowflake.roles.friend;
	const friendText =
		"gehört meinen **Freunden**, die mein Kidnapping unterstützen";
	const friendMembers = getMember(friend);

	const youtube = snowflake.roles.youtube;
	const youtubeText = "gehört den **Youtubern**, die ich cool finde";
	const youtubeMembers = getMember(youtube);

	const artist = snowflake.roles.artist;
	const artistText = "gehört den **Künstlern** die gut Zeichnen können ^^";
	const artistMembers = getMember(artist);

	const beifahrer = snowflake.roles.levellingRole6;
	const beifahrerText =
		"gehört denen die **Lvl 100** erreicht haben, ihr habt nun den Schlüssel vom Van HGW";
	const beifahrerMembers = getMember(beifahrer);

	const meisterMitentfuehrer = snowflake.roles.levellingRole5;
	const meisterMitentfuehrerText =
		"gehört denen die **Lvl 80** erreicht haben, ihr seid die wahren Meister des Kidnapping";

	const mitentfuehrer = snowflake.roles.levellingRole4;
	const mitentfuehrerText =
		"gehört denen die **Lvl 60** erreicht haben, weiter so ihr unterstützt mein Kidnapping";
	const mitentfuehrerMembers = getMember(mitentfuehrer);

	const schuldig = snowflake.roles.levellingRole3;
	const schuldigText =
		"gehört denen die **Lvl 40** erreicht haben, du hast zu viel gesehen...Im Sorry";
	const schuldigMembers = getMember(schuldig);

	const verdaechtig = snowflake.roles.levellingRole2;
	const verdaechtigText =
		"gehört denen die **lvl 20** erreicht haben, dein Verhalten ist sehr..speziell geworden..";
	const verdaechtigMembers = getMember(verdaechtig);

	const unschuldig = snowflake.roles.levellingRole1;
	const unschuldigText =
		"gehört **Allen**, du bist noch neu und so unschuldig hihhihii..";
	const unschuldigMembers = getMember(unschuldig);

	const team = `

  ${purple}${fahrer}
  > ${fahrerText}
  ${fahrerMembers}

  ${blue}${dev}
  > ${devText}
  ${devMembers}

  ${green}${mod}
  > ${modText}
  ${modMembers}

  ${pink}${emotes}
  > ${emotesText}
  ‎ 
  ‎ 
  `;
	const special = `
  ${pink}${upgrader}
  > ${upgraderText}

  ${pink}${friend}
  > ${friendText}

  ${pink}${youtube}
  > ${youtubeText}

  ${pink}${artist}
  > ${artistText}
  ‎ 
  ‎ 
  `;

	const level = `
  ${pink}${beifahrer}
  > ${beifahrerText}

  ${pink}${meisterMitentfuehrer}
  > ${meisterMitentfuehrerText}

  ${pink}${mitentfuehrer}
  > ${mitentfuehrerText}

  ${pink}${schuldig}
  > ${schuldigText}

  ${pink}${verdaechtig}
  > ${verdaechtigText}

  ${pink}${unschuldig}
  > ${unschuldigText}
  `;

	const embed = new EmbedBuilder()
		.setTitle("Rollen Erklärung")
		.setDescription(`Hier sind die Rollen und ihre Bedeutung im Van erklärt.`)
		.addFields({
			name: "**Das Van Team**",
			value: team,
		})
		.addFields({
			name: "**Besondere Menschen**",
			value: special,
		})
		.addFields({
			name: "**Level**",
			value: level,
		})
		.setFooter({
			text: snowflake.members.tuubaa?.displayName || "tuubaa",
			iconURL: snowflake.members.tuubaa?.displayAvatarURL(),
		})
		.setTimestamp(new Date().getTime())
		.setThumbnail(snowflake.guild.iconURL())
		.setColor(Colors.Red);

	return embed;
}
