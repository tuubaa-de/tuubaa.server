import {Events} from "discord.js";
import {client} from "../../../bot";
import {sleep} from "../../../lib/utils";
import {addUserExperience} from "../addUserExperience";
import {evalTextMessage} from "../levelHelper";
import {Deque} from "../deque";

/**
 * Initialize the message levelling system
 * Important: Call this function exactly once on bot setup
 */
export async function initMessageXPEvaluator() {

	const server_timestamps: Deque<Date> = new Deque<Date>();
	const user_timestamps: { [key: string]: Deque<Date> } = {};
	const aMinute: number = 1, anHour: number = 60, aDay: number = 1440, aWeek: number = 10080;

	client.on(Events.MessageCreate, async (message) => {
		// If the message is from a bot, return
		if (message.author.bot || !message.member) return;
		// Grab current time
		const now: Date = new Date();
		// Commit this timestamp to the server
		server_timestamps.pushFront(now);
		// Make sure user has a timestamp deque
		if (!user_timestamps[message.author.id]) user_timestamps[message.author.id] = new Deque<Date>();
		// Commit this timestamp to the user
		user_timestamps[message.author.id].pushFront(now);

		// 10s Cooldown since last message?
		if (now.getTime() - user_timestamps[message.author.id].peekBack()!.getTime() < 10000) return;

		// Clear old timestamps for the server (old = out of window)
		while (
			server_timestamps.peekBack() && server_timestamps.peekBack()!.getTime() < now.getTime() - anHour
			) {
			server_timestamps.popBack();
		}

		// Clear old timestamps for every user (old = out of window)
		for (const [key, value] of Object.entries(user_timestamps)) {
			while (
				value.peekBack() &&
				(value.peekBack() || new Date() /*ugly hack to not-undefine the peeked value*/).getTime() < now.getTime() - aDay
				) {
				value.popBack();
			}
		}

		// Count the number of messages in the last hour
		let server_activity_hour: number = 0;
		for (let i = 0; i < server_timestamps.size(); i++) {
			if (server_timestamps.peekAt(i)!.getTime() > now.getTime() - anHour) {
				server_activity_hour = i;
				break;
			}
		}

		// Count the number of messages from the user in the last day
		let user_activity_week: number = 0, user_activity_day: number = 0;
		for (let i = 0; i < user_timestamps[message.author.id].size(); i++) {
			if (user_activity_day == 0 && user_timestamps[message.author.id].peekAt(i)!.getTime() > now.getTime() - aDay) {
				user_activity_day = i;
			}
			if (user_timestamps[message.author.id].peekAt(i)!.getTime() > now.getTime() - aWeek) {
				user_activity_week = i;
				break;
			}
		}


		// Add XP based on evaluation
		// daytime is the current time of day in minutes
		const daytime = new Date().getHours() * 60 + new Date().getMinutes();
		await addUserExperience(message.member, evalTextMessage(message, daytime, server_activity_hour, user_activity_day, user_activity_week));

		// Wait for cooldown
		await sleep(10000);

	});
}
