import { Module } from "../../types/module";
import { reaction } from "./commands/reactions";

async function entry() {
  console.log(">> Roleplay System loaded");
}

export const roleplay = new Module({
  name: "roleplay",
  commands: [reaction],
  entry: entry,
});
