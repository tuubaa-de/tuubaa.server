import { Events } from "discord.js";
import { client } from "../../../bot";
import { snowflake } from "../../../lib/snowflake";

export async function greetMember() {
  client.on(Events.GuildMemberAdd, async (member) => {
    await snowflake.channels.general?.send(
      `Ein neuer gefanger im **goldenen Van**! Begrüßt ${member}! <:HeyTuba:1137369596496707624>`
    );
  });
}
