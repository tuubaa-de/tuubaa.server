// Purpose: Example

import { z } from "zod";
import { publicProcedure, router } from "../../endpoint";
import { Module } from "../../types/module";
import { fun, ping } from "./commands";
import { registerSlash } from "./events/registerSlash";
import { testing } from "./events/testing";

async function entry() {
  console.log(">> utils loaded");

  // load register commands
  registerSlash();
  testing();
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
