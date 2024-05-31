// Purpose: Example

import { z } from "zod";
import { publicProcedure, router } from "../../endpoint";
import { Module } from "../../types/module";
import { fun, ping } from "./commands";
import { registerSlash } from "./events/registerSlash";
import { testing } from "./events/testing";
import { goodMorning } from "./events/goodMorning";
import { snowflake } from "../../lib/snowflake";

async function entry() {
  console.log(">> utils loaded");

  snowflake.updateChannel("general", "1009764889641897985");

  registerSlash();

  testing();
  goodMorning();
}

export const utilsRouter = router({
  list: publicProcedure.query(() => {
    return "test";
  }),
});

export const utils = new Module({
  name: "utils",
  commands: [ping, ...fun],
  entry: entry,
});
