import { Colors, Embed, Role } from "discord.js";
import { Module } from "../../types/module";
import { EmbedBuilder } from "@discordjs/builders";
import { snowflake } from "../../lib/snowflake";
import { createRoleEmbed } from "./commands/createRoleEmbed";

async function entry() {
  console.log(">> Role Explain Module Loaded");

  snowflake.updateRole("owner", "1009763136586387467");
  snowflake.updateRole("dev", "1009767438071648296");
  snowflake.updateRole("manager", "1224092798924492921");
  snowflake.updateRole("mod", "1009767209259765912");
  snowflake.updateRole("emotes", "1041351990728478852");

  snowflake.updateRole("upgrader", "1041351990728478852");
  snowflake.updateRole("friend", "1031295240281268284");
  snowflake.updateRole("youtube", "1009767553767313418");
  snowflake.updateRole("artist", "1188103824028737546");

  snowflake.updateRole("beifahrer", "1090728365490720799");
  snowflake.updateRole("mitentfuehrer", "1090728235765084183");
  snowflake.updateRole("schuldig", "1090728047721844796");
  snowflake.updateRole("verdaechtig", "1245722673984704542");
  snowflake.updateRole("unschuldig", "1009762884626169947");
}

export const roleExplain = new Module({
  commands: [createRoleEmbed],
  entry: entry,
  name: "Role Explain",
});

export async function buildRoleEmbed() {
  const purple = "<:purple:1138230018376482866>";
  const blue = "<:blue:1138230016002502757>";
  const yellow = "<:yellow:1138230010742841374>";
  const green = "<:green:1138230014580621342> ";
  const pink = "<:pink:1138230011787227188>";

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

  const beifahrer = snowflake.roles.beifahrer;
  const beifahrerText =
    "gehört denen die **Lvl 100** erreicht haben, ihr habt nun den Schlüssel vom Van HGW";
  const beifahrerMembers = getMember(beifahrer);

  const mitentfuehrer = snowflake.roles.mitentfuehrer;
  const mitentfuehrerText =
    "gehört denen die **Lvl 75** erreicht haben, weiter so ihr unterstützt mein Kidnapping";
  const mitentfuehrerMembers = getMember(mitentfuehrer);

  const schuldig = snowflake.roles.schuldig;
  const schuldigText =
    "gehört denen die **Lvl 50** erreicht haben, du hast zu viel gesehen...Im Sorry";
  const schuldigMembers = getMember(schuldig);

  const verdaechtig = snowflake.roles.verdaechtig;
  const verdaechtigText =
    "gehört denen die **lvl 25** erreicht haben, dein Verhalten ist sehr..speziell geworden..";
  const verdaechtigMembers = getMember(verdaechtig);

  const unschuldig = snowflake.roles.unschuldig;
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

  ${yellow}${manager}
  > ${managerText}
  ${managerMembers}

  ${green}${mod}
  > ${modText}
  ${modMembers}

  ${pink}${emotes}
  > ${emotesText}
  ${emotesMembers}
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
