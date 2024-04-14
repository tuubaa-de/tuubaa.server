import { Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { moduleManager } from "./module/handler";

// dotenv.config({ path: `.env.${process.env["ENV"]}` });
dotenv.config();

export let client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

export default {
  run,
};

export const uptime = Date.now();

async function run() {
  client.login(process.env["BOT_TOKEN"]);
  moduleManager.listenCommands();
  moduleManager.listenError();
  client.once(Events.ClientReady, () => {
    moduleManager.load();
  });
  client.on(Events.InteractionCreate, async (interaction) => {
    console.log(interaction);
  });
}
