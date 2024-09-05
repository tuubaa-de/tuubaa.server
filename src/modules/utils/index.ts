// Purpose: Example

import {publicProcedure, router} from "../../endpoint";
import {Module} from "../../types/module";
import {keks, ping, sayAsBot} from "./commands";
import {registerSlash} from "./events/registerSlash";
import {testing} from "./events/testing";
import {goodMorning} from "./events/goodMorning";

async function entry() {
	console.log(">> utils loaded");

	registerSlash();

	testing();
	goodMorning();
}

export const utilsRouter = router({
	list: publicProcedure.query(() => {
		return "test";
	}),
});

export const utils = new Module({
	name: "utils",
	commands: [ping, sayAsBot, keks],
	entry: entry,
});
