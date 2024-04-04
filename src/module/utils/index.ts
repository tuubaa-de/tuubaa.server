// Purpose: Example

import { t } from "../../endpoint";
import { Module } from "../../types/module";
import { registerSlash } from "./events/registerSlash";

const router = t.router({});

async function entry() {
  console.log(">> utils loaded");

  // load register commands
  registerSlash();
}

export const utils = new Module({
  name: "utils",
  commands: [],
  entry: entry,
  router: router,
});
