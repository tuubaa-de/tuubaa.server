import { Module } from "../../types/module";
import { moderationCommand } from "./commands";

async function entry() {
  console.log(">> Moderation Module loaded");
}

export const moderation = new Module({
  name: "moderation",
  entry: entry,
  commands: [],
});
