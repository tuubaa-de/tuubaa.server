import {prisma} from "../../lib/database";

export class LevelDatabase {
	static async getXP(userId: string) {
		return prisma.level.findUnique({
			where: {
				userId: userId,
			},
		});
	}

	static async getAllXP() {
		return prisma.level.findMany({
			orderBy: [
				{
					dezixp: "desc",
				},
			],
		});
	}

	static async getTopXP(limit: number) {
		return prisma.level.findMany({
			orderBy: [
				{
					dezixp: "desc",
				},
			],
			take: limit,
		});
	}

	static async updateXP(userId: string, dezixp: number) {
		return prisma.level.upsert({
			where: {
				userId: userId,
			},
			update: {
				dezixp: dezixp,
			},
			create: {
				userId: userId,
				dezixp: dezixp,
			},
		});
	}
}
