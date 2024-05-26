import { Events } from "discord.js";
import { client } from "../../../bot";
import { snowflake } from "../../../lib/snowflake";
import { emotes } from "../../../lib/utils";

export async function testing() {
  client.on(Events.MessageCreate, async (message) => {
    return;
    if (
      !message.content.startsWith("!") ||
      message.author.id !== snowflake.members.time?.id
    ) {
      return;
    }

    const content = message.content.replace("! ", "");

    console.log(emotes(content));
    console.log(emotes("<:yea:123456789012345678>"));
  });
}
