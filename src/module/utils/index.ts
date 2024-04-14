// Purpose: Example

import { z } from "zod";
import { publicProcedure, router } from "../../endpoint";
import { Module } from "../../types/module";
import { ping } from "./commands";
import { registerSlash } from "./events/registerSlash";

async function entry() {
  console.log(">> utils loaded");

  // load register commands
  registerSlash();
}

const utilsRouter = router({
  list: publicProcedure.query(() => {
    // [..]
    return [];
  }),
});

export const utils = new Module({
  name: "utils",
  commands: [ping],
  entry: entry,
  router: utilsRouter,
});
