import { Module } from "../../types/module";
import { auditlog } from "./events/auditlog";

async function entry() {
  console.log(">> logs module loaded");

  auditlog();
}

export const logs = new Module({
  name: "logs",
  entry: entry,
  commands: [],
});
