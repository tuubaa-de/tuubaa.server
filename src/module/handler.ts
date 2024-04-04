import {
  QueryProcedure,
  Router,
} from "@trpc/server/unstable-core-do-not-import";
import { Commands } from "../types/commands";
import { t } from "../endpoint";
// import { utils } from "./utils";
import { client } from "../bot";
import { Client, Events } from "discord.js";
import { snowflake } from "../lib/snowflake/init";
import { ready } from "./ready";
import { Module } from "../types/module";
import { utils } from "./utils";

class ModuleManager {
  modules: { module: Module; enabled: boolean }[];

  // TODO: implement dynamic modul system via discord
  //   add(module: Module) {
  //     this.modules.push({ module, enabled: true });
  //   }

  constructor(data: Partial<ModuleManager>) {
    this.modules = data.modules || [];
  }

  async listenError() {
    process.on("unhandledRejection", (error) => {
      console.log("Unhandled promise rejection:", error);
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
  }

  async listenCommands() {
    const commands = new Map<string, Commands>();

    this.modules.forEach((module) => {
      module.module.commands.forEach((command) => {
        commands.set(command.data.name, command);
      });
    });

    client.on("interactionCreate", async (interaction) => {
      console.log(interaction);
      if (!interaction.isChatInputCommand()) return;

      const command = commands.get(interaction.commandName);

      if (!command) {
        console.error(`Command not found: ${interaction.commandName}`);
        return;
      }

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
  ],
});
