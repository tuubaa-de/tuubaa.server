import {client} from "../../bot";
import {router} from "../../endpoint";
import {snowflake} from "../../lib/snowflake";
import {Module} from "../../types/module";

export const readyRouter = router({});

async function entry() {
	console.log(`Client loaded with ${client.user?.tag}`);
	snowflake.updateMember("time", "795306274467348510");
}

export const ready = new Module({
	name: "ready",
	commands: [],
	entry: entry,

});
