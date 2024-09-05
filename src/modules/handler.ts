import {Commands} from "../types/commands";
// import { utils } from "./utils";
import {client} from "../bot";
import {Events} from "discord.js";
import {ready} from "./ready";
import {Module} from "../types/module";
import {utils} from "./utils";
import {snowflake} from "../lib/snowflake";
import {level} from "./level";
import {voice} from "./voice";
import {roleplay} from "./roleplay";
import {music} from "./music";
import {welcome} from "./welcome";
import {ticket} from "./ticket";
import {logs} from "./logs";
import {roleExplain} from "./roleExplain";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {rules} from "./rules";
import {moderation} from "./moderation";

class ModuleManager {
	modules: {
		module: Module;
		enabled: boolean;
	}[];

	// TODO: implement dynamic modul system via discord
	//   add(module: Module) {
	//     this.modules.push({ module, enabled: true });
	//   }

	constructor(data: Partial<ModuleManager>) {
		this.modules = data.modules || [];
	}

	async listenError() {
		process.on("unhandledRejection", (error) => {
			console.log("unhandledRejection:", error);
		});

		process.on("uncaughtException", (error) => {
			if (error instanceof PrismaClientKnownRequestError) {
				switch (error.code) {
					case "1001":
						console.log("Can't reach Database connection");
						return;
				}
				return;
			}

			console.log("uncaughtException:", error);
		});

		client.on(Events.Error, (error) => {
			console.log("client error:", error);
		});
	}

	async init() {
		if (!client.isReady()) {
			throw new Error("Client is not ready");
		}

		await snowflake.load();
		moduleManager;
	}

	async listenCommands() {
		const commands = new Map<string, Commands>();

		this.modules.forEach((module) => {
			module.module.commands.forEach((command) => {
				commands.set(command.data.name, command);
			});
		});

		client.on(Events.InteractionCreate, async (interaction) => {
			if (!interaction.isChatInputCommand()) return;

			const command = commands.get(interaction.commandName);

			if (!command) {
				console.error(`Command not found: ${interaction.commandName}`);
				return;
			}

			// TODO: import data from SlashCommandPermissionsBuilder

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: "Es kam ein Fehler beim benutzen!",
						ephemeral: true,
					});
				} else {
					await interaction.reply({
						content: "Es kam ein Fehler beim benutzen!",
						ephemeral: true,
					});
				}
			}
		});
	}

	async load() {
		await this.init();

		Promise.all(
			this.modules
				.filter((module) => module.enabled)
				.map(async (module) => module.module.entry())
		);
	}
}

export const moduleManager = new ModuleManager({
	// TODO: to dynamic import modules
	modules: [
		{
			module: ready,
			enabled: true,
		},
		{
			module: utils,
			enabled: true,
		},
		{
			module: level,
			enabled: true,
		},
		{
			module: voice,
			enabled: true,
		},
		{
			module: rules,
			enabled: true,
		},
		{
			module: roleplay,
			enabled: true,
		},
		{
			module: music,
			enabled: true,
		},
		{
			module: welcome,
			enabled: true,
		},
		{
			module: ticket,
			enabled: true,
		},
		{
			module: logs,
			enabled: true,
		},
		{
			module: roleExplain,
			enabled: true,
		},
		{
			module: moderation,
			enabled: true,
		},
	],
});
