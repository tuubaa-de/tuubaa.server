import {Events, GatewayIntentBits} from "discord.js";
import {moduleManager} from "./modules/handler";
import {ClientWrapper} from "./models/client";
import {calcLevel} from "./modules/level/levelHelper";

export let client = new ClientWrapper({
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildIntegrations,
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
}
