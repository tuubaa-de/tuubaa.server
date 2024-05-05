import { Player, useMainPlayer } from "discord-player";
import { client } from "../../bot";
import { Module } from "../../types/module";
import { Interaction } from "discord.js";
import { SlashInteraction } from "../../types/commands";
import { musicController } from "./commands";

async function entry() {
  console.log(">> Music System loaded");

  await player.extractors.loadDefault((ext) => ext !== "YouTubeExtractor");

  player.events.on("playerStart", (queue, track) => {
    // we will later define queue.metadata object while creating the queue
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
  });
}
const player = new Player(client);

export const music = new Module({
  name: "music",
  commands: [musicController],
  entry: entry,
});
