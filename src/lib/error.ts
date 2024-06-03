import {snowflake} from "./snowflake";

export default {
	guildNotFound: () => {
		throw new Error(`Guild not found with the id ${snowflake.guild?.id}`);
	},
};
