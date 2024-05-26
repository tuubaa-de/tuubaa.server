import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Guild,
  GuildMember,
  Interaction,
  User,
} from "discord.js";
import { Module } from "../../types/module";
import { LevelDatabase } from "./database";
import { onMessage } from "./events/message";
import { snowflake } from "../../lib/snowflake";
import { myLevel } from "./commands/myLevel";
import { onVoice } from "./events/voice";
import { topLevels } from "./commands/top";
import { SlashInteraction } from "../../types/commands";
import { Top } from "canvafy";
import { topInteration } from "./events/top";

async function entry() {
  console.log(">> Level System loaded");

  onMessage();
  onVoice();
  topInteration();
}

export const level = new Module({
  name: "level",
  commands: [myLevel, topLevels],
  entry: entry,
});

export async function sendLevelMessage(user: GuildMember | User) {
  const levelData = await LevelDatabase.getLevel(user.id);

  const channel = snowflake.channels.bot;

  if (!channel || !levelData) {
    return;
  }
  await channel.send(
    `Congratulations ${user.displayName}! You are now level ${levelData.level}`
  );
}

export async function topBuilder(site: number, interaction: Interaction) {
  const allLevelData = await LevelDatabase.getAllLevels();

  const guild = interaction.guild as Guild;

  await interaction.guild?.members.fetch();

  const modifiedData = (
    await Promise.all(
      allLevelData.map(async (data, index) => {
        const user = interaction.guild?.members.cache.get(data.userId) || null;
        return {
          level: data.level,
          xp: data.xp,
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
