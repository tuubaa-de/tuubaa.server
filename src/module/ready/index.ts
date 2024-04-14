import { client } from "../../bot";
import { router } from "../../endpoint";
import { Module } from "../../types/module";

const readyRouter = router({});

async function entry() {
  console.log(`Client loaded with ${client.user?.tag}`);
}

export const ready = new Module({
  name: "ready",
  commands: [],
  entry: entry,
  router: readyRouter,
});
