import {prisma} from "../../lib/database";

export class UtilDatabase {
	static async getKeks(userId: string) {
		return await prisma.keks.findUnique({
			where: {
				userId: userId,
			},
		});
	}

	static async getAllKeks() {
		return await prisma.keks.findMany({
			orderBy: [
				{
					keks: "desc",
				},
			],
		});
	}

	static async addKeks(userId: string) {
		await prisma.keks.upsert({
			where: {
				userId: userId,
			},
			update: {
				keks: {
					increment: 1,
				},
			},
			create: {
				userId: userId,
				keks: 1,
			},
		});
	}
}
