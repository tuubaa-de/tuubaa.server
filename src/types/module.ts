import { Router, RouterRecord } from "@trpc/server/unstable-core-do-not-import";
import { Commands } from "./commands";

export class Module<
  TRoot extends { ctx: any; meta: any; errorShape: any; transformer: any },
  TRecord extends RouterRecord
> {
  name: string;
  commands: Commands[];
  entry: () => Promise<void>;
  router: Router<TRoot, TRecord>;

  constructor(data: Required<Module<TRoot, TRecord>>) {
    this.name = data.name;
    this.commands = data.commands;
    this.entry = data.entry;
    this.router = data.router;
  }
}
