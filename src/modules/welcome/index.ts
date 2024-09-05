import {Module} from "../../types/module";
import {welcomeMessage} from "./events/welcomeMessage";
import {greetMember} from "./events/greetMember";
import {rememberRole} from "./events/remberRole";

async function entry() {
	console.log(">> Welcome System loaded");

	welcomeMessage();
	await greetMember();
	await rememberRole();
}

export const welcome = new Module({
	name: "welcome",
	commands: [],
	entry: entry,
});
