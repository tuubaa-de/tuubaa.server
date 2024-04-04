import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export class Database {
  static config = {
    get: async (name: string) => {
      const result = await prisma.config.findUnique({
        where: {
          name: name,
        },
      });

      if (!result) {
        console.log(`Snowflake ${name} not found`);
        console.log(
          `Creating snowflake ${name} with empty id. Please add id to the snowflake`
        );
        await prisma.config.create({
          data: {
            name: name,
            id: "",
          },
        });

        return "";
      }

      return result.id;
    },
  };
}
