import {Module} from "../../types/module";
import {createVoice} from "./events/createChannel";

async function entry() {
	console.log(">> Voice System loaded");

	createVoice();
}

export const voice = new Module({
	name: "voice",
	commands: [],
	entry: entry,
});
