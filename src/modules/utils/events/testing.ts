import { Events } from "discord.js";
import { client } from "../../../bot";
import { snowflake } from "../../../lib/snowflake";
import { emotes } from "../../../lib/utils";

export async function testing() {
  client.on(Events.MessageCreate, async (message) => {
    // returnbug
    if (
      !message.content.startsWith("!") ||
      message.author.id !== snowflake.members.time?.id
    ) {
      return;
    }

    const guild = message.guild!;

    const content = message.content.replace("! ", "");

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
