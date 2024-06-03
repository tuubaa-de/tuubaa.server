import {Module} from "../../types/module";
import {rolePlay} from "./commands/reactions";

async function entry() {
	console.log(">> Roleplay System loaded");
}

export const roleplay = new Module({
	name: "roleplay",
	commands: [rolePlay],
	entry: entry,
});
