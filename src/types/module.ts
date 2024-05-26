import { Commands } from "./commands";

export class Module {
  name: string;
  commands: Commands[];
  entry: () => Promise<unknown>;

  constructor(data: Required<Module>) {
    this.name = data.name;
    this.commands = data.commands;
    this.entry = data.entry;
  }
}
