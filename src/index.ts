import bot from "./bot";
import { publicProcedure, t } from "./endpoint";

const appRouter = t.router({
  userList: publicProcedure.query(async () => {}),
});

export type AppRouter = typeof appRouter;

bot.run();
