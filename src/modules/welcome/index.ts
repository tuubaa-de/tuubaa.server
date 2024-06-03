import {Module} from "../../types/module";
import {snowflake} from "../../lib/snowflake";
import {welcomeMessage} from "./events/welcomeMessage";
import {greetMember} from "./events/greetMember";
import {rememberRole} from "./events/remberRole";

async function entry() {
	console.log(">> Welcome System loaded");

	snowflake.updateChannel("welcome", "1009762551636172850");
	snowflake.updateChannel("general", "1009764889641897985");
	welcomeMessage();
	greetMember();
	rememberRole();
}

export const welcome = new Module({
	name: "welcome",
	commands: [],
	entry: entry,
});
