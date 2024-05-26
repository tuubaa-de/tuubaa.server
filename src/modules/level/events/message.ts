import { Events, time } from "discord.js";
import { client } from "../../../bot";
import { sleep } from "../../../lib/utils";
import { addXP } from "../addXp";

export async function onMessage() {
  const lastUserChannel: { [key: string]: string } = {};

  const timeout = new Array<String>();

  const lastMessageContent: { [key: string]: string } = {};

  let timer = setTimeout(() => {
    Object.keys(lastUserChannel).forEach((key) => {
      lastUserChannel[key] = "";
    });
  }, 60 * 1000);

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) {
      return;
    }

    timer.refresh();
    const currentPersonInTimeout = lastUserChannel[message.channelId];

    if (
      lastMessageContent[message.author.id] == message.content ||
      currentPersonInTimeout == message.author.id ||
      timeout.includes(message.author.id)
    ) {
      return;
    }

    timeout.push(message.author.id);

    lastMessageContent[message.author.id] = message.content;
    lastUserChannel[message.channelId] = message.author.id;

    if (message.member == null) {
      return;
    }

    await addXP(message.member, 6);

    await sleep(3 * 1000);

    timeout.splice(timeout.indexOf(message.author.id), 1);
  });
}
