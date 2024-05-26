import {
  Events,
  Message,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { client } from "../../../bot";
import { moduleManager } from "../../handler";
import { snowflake } from "../../../lib/snowflake";

// NOTFALL FÜR SLASH COMMANDS
export async function registerSlash() {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (
      !message.content.startsWith("!!!registerSlash") ||
      message.author.id !== snowflake.members.time?.id
    ) {
      return;
    }

    await message.delete();

    console.log("Registering slash commands...");

    let commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    moduleManager.modules.forEach((module) => {
      module.module.commands.forEach((command) => {
        commands.push(command.data.toJSON());
      });
    });

    const rest = new REST().setToken(process.env["BOT_TOKEN"] || "");

    const clientId = process.env["CLIENT_ID"];
    // const guildId = snowflake.guild.id;

    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands.`
      );

      if (!clientId) {
        throw "Guild Id or Client Id is missing in .env";
      }

      // discord.js build some shit
      const data: any = await rest.put(
        Routes.applicationGuildCommands(clientId, message.guild!.id),
        { body: commands }
      );

      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  });
}
