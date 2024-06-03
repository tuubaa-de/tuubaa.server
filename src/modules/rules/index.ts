import {info} from "console";
import {Module} from "../../types/module";
import {onModalSubmit} from "./events/createRuleHandler";
import {createRule} from "./commands/createRule";

async function entry() {
	info(">> Rules Module loaded");

	onModalSubmit();
}

export const rules = new Module({
	name: "rules",
	entry: entry,
	commands: [createRule],
});
