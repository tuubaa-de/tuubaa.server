import { prisma } from "../../lib/database";

export class LevelDatabase {
  static async getLevel(userId: string) {
    return await prisma.level.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  static async getAllLevels() {
    return await prisma.level.findMany({
      orderBy: [
        {
          level: "desc",
        },
        {
          xp: "desc",
        },
      ],
    });
  }

  static async updateLevel(userId: string, level: number, xp: number) {
    await prisma.level.upsert({
      where: {
        userId: userId,
      },
      update: {
        xp: xp,
        level: level,
      },
      create: {
        userId: userId,
        xp: xp,
        level: level,
      },
    });
  }
}
