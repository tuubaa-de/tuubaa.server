import { CronJob } from "cron";
import { snowflake } from "../../../lib/snowflake";

export async function goodMorning() {
  const channel = snowflake.channels.general;

  const morning = async () => {
    await channel?.send(
      "Guten Morgen, gefange des Van's! <a:kuruukuruu:1196834923206672494>"
    );
  };

  const night = async () => {
    await channel?.send(
      "Gute Nacht, gefange des Van's! <:TuubaaAwake:1244353418894643271>"
    );
  };

  const job = new CronJob("08 00 00 * * *", morning);
  const job2 = new CronJob("23 00 00 * * *", night);

  job.start();
  job2.start();
}
