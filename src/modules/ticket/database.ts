import {prisma} from "../../lib/database";

export class TicketDatabase {
	static async createTicket(options: {
		messageId: string;
		channelId: string;
		title: string;
		description: string;
	}) {
		await prisma.ticket.create({
			data: {
				messageId: options.messageId,
				channelId: options.channelId,
				title: options.title,
				description: options.description,
			},
		});
	}

	static async getTicket(messageId: string) {
		return await prisma.ticket.findUnique({
			where: {
				messageId,
			},
		});
	}
}
