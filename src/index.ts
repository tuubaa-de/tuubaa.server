import bot from "./bot";
import {publicProcedure, router} from "./endpoint";
import {snowflakeRouter} from "./lib/snowflake";
import * as dotenv from "dotenv";
import {createHTTPHandler} from "@trpc/server/adapters/standalone";
import {utilsRouter} from "./modules/utils";
import {readyRouter} from "./modules/ready";
import {createServer} from "http";

var command_args = process.argv;

if (command_args.includes("-p")) {
	console.log("Prduction mode");
	dotenv.config({path: `.env.production`});
} else {
	console.log("Development mode");
	dotenv.config({});
}

export const appRouter = router({
	snowflake: snowflakeRouter,
	hello: publicProcedure.query((props) => {
		return "Hello, world!";
	}),
	utils: utilsRouter,
	ready: readyRouter,
});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
	router: appRouter,
	createContext() {
		return {};
	},
});
const server = createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Request-Method", "*");
	res.setHeader("Access-Control-Allow-Methods", "*");
	res.setHeader("Access-Control-Allow-Headers", "*");
	if (req.method === "OPTIONS") {
		res.writeHead(200);
		return res.end();
	}
	handler(req, res);
});

server.listen(3333);

server.on("request", (lol) => {
});

bot.run();
