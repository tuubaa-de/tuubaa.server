import {prisma} from "../../lib/database";

export class VoiceDatabase {
	static async getUserConfig(userId: string) {
		return await prisma.userConfig.findUnique({
			where: {
				userId: userId,
			},
		});
	}

	static async getVoiceChannel(voiceId: string) {
		return await prisma.voice.findUnique({
			where: {
				voiceId: voiceId,
			},
			include: {
				VoiceAccess: true,
			},
		});
	}

	static async getAllVoiceChannels() {
		return await prisma.voice.findMany();
	}
}
