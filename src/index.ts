import bot from "./bot";
import { publicProcedure, router } from "./endpoint";
import { snowflake, snowflakeRouter } from "./lib/snowflake";
import {
  createHTTPHandler,
  createHTTPServer,
} from "@trpc/server/adapters/standalone";
import { utilsRouter } from "./module/utils";
import { readyRouter } from "./module/ready";
import { nodeHTTPRequestHandler } from "@trpc/server/dist/adapters/node-http";
import cors from "cors";
import { createServer } from "http";

export const appRouter = router({
  snowflake: snowflakeRouter,
  hello: publicProcedure.query((props) => {
    console.log("hello", props);
    return "Hello, world!";
  }),
  utils: utilsRouter,
  ready: readyRouter,
});

export type AppRouter = typeof appRouter;

const handler = createHTTPHandler({
  router: appRouter,
  createContext() {
    console.log("context 3");
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
  console.log(lol.statusCode, lol.statusMessage, lol.method, lol.url);
});

bot.run();
