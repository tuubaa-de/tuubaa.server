import { Events } from "discord.js";
import { client } from "../../../bot";
import { snowflake } from "../../../lib/snowflake";
import { readFileSync } from "fs";
import { prisma } from "../../../lib/database";

export async function testing() {
  client.on(Events.MessageCreate, async (message) => {
    // returnbug
    const newVideo = ["video", "neues", "wann"];

    if (newVideo.every(item => message.content.toLowerCase().includes(item))) {
      await message.reply("https://youtu.be/4btyXfex_8w");
    }

    if (
      !message.content.startsWith("!") ||
      message.author.id !== snowflake.members.time?.id
    ) {
      return;
    }

    const guild = message.guild!;

    const content = message.content.replace("! ", "");

    if (content != "test") {
      return;
    }

    const data = readFileSync("level.json", "utf-8");

    const level: { [key: string]: number } = JSON.parse(data);

    // console.log(level);

    for (const [key, value] of Object.entries(level)) {
      await prisma.level.upsert({
        where: {
          userId: key,
        },
        update: {
          dezixp: value,
        },
        create: {
          userId: key,
          dezixp: value,
        },
      });
    }

    // for (const channel of guild.channels.cache.values()) {
    //   if (channel.parentId == "1137862329875320873") {
    //     try {
    //       console.log("Deleting channel: ", channel.name);
    //       await channel.delete();
    //     } catch (error) {
    //       console.log("Error deleting channel: ", channel.name, error);
    //     }
    //   }
    // }
  });
}
