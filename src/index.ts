import { z } from "zod";
import bot from "./bot";
import { publicProcedure, router } from "./endpoint";
import { snowflakeRouter } from "./lib/snowflake";
import { moduleManager } from "./module/handler";
import { utils } from "./module/utils";

const appRouter = router({
  snowflake: snowflakeRouter,
  ...moduleManager.getRoutes(),
});

export type AppRouter = typeof appRouter;

bot.run();
