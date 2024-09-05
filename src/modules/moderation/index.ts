import {Module} from "../../types/module";

async function entry() {
	console.log(">> Moderation Module loaded");
}

export const moderation = new Module({
	name: "moderation",
	entry: entry,
	commands: [],
});
