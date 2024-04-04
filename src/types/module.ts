import { Router } from "@trpc/server/unstable-core-do-not-import";
import { Commands } from "./commands";

export class Module {
  name: string;
  commands: Commands[];
  entry: () => Promise<void>;
  router: Router<any, any>;

  constructor(data: Required<Module>) {
    this.name = data.name;
    this.commands = data.commands;
    this.entry = data.entry;
    this.router = data.router;
  }
}
