import {Message} from "discord.js";

export const levellingConfig = {
	LEVELLING_FUNCTION_FACTOR: 200,
	MAX_LEVEL: 100,

	VOICE_PER_MINUTE_BASE_EXP: 55,
	VOICE_UNMUTE_MULTIPLIER: 1,
	VOICE_MUTE_MULTIPLIER: 0.5,
	VOICE_DEAF_MULTIPLIER: 0,
	VOICE_FALLOFF_START: 2 * 60,
	VOICE_FALLOFF_END: 12 * 60,
	VOICE_FALLOFF_FROM: 1,
	VOICE_FALLOFF_TO: 0,

	TEXT_PER_MESSAGE_BASE_XP: 55,
	TEXT_BASE_XP: 33,
	TEXT_PER_CHAR_XP: 0.5,
	TEXT_MAX_LENGTH: 200,
	TEXT_FUNC_OFFSET_X: 0.6,
	TEXT_FUNC_OFFSET_Y: 0.25,
	TEXT_FUNC_CONST_A: 0.5,
	TEXT_FUNC_EXP_BASE: Math.E,
	TEXT_COOLDOWN: 10,
	TEXT_FALLOFF_DAILY_START: 100,
	TEXT_FALLOFF_DAILY_END: 600,
	TEXT_FALLOFF_DAILY_FROM: 1,
	TEXT_FALLOFF_DAILY_TO: 0,
	TEXT_FALLOFF_WEEKLY_START: 1000,
	TEXT_FALLOFF_WEEKLY_END: 4000,
	TEXT_FALLOFF_WEEKLY_FROM: 1,
	TEXT_FALLOFF_WEEKLY_TO: 0,
	TEXT_LOCKDOWNS: [[0, 6 * 60], [8 * 60, 12 * 60]],
}

/**
 * Calculate the level of a user based on their XP
 * @param xp the XP of the user
 */
export function calcLevel(xp: number): number {
	return xp < 0 ? 0 :
		Math.min(
			Math.floor(
				Math.sqrt(
					xp / levellingConfig.LEVELLING_FUNCTION_FACTOR)),
			levellingConfig.MAX_LEVEL);
}

/**
 * Calculate the XP required to reach the next level
 * @param xp the XP of the user
 */
export function xpToNextLevel(xp: number): number {
	return xp < 0 ? levellingConfig.LEVELLING_FUNCTION_FACTOR :
		levellingConfig.LEVELLING_FUNCTION_FACTOR * Math.pow(calcLevel(xp) + 1, 2) - xp;
}


/**
 * Evaluate the XP of a message, considering the current activity, both server and user
 * @param text the message to evaluate
 * @param daytime the time of day, from 0 to 1440 minutes (24h * 60m)
 * @param server_activity number of messages on the server in the last HOUR
 * @param user_activity_daily number of messages from the user in the last DAY / 24h
 * @param user_activity_weekly
 */
export function evalTextMessage(
	text: Message,
	daytime: number,
	server_activity: number,
	user_activity_daily: number,
	user_activity_weekly: number
): number {
	const
		lengthCalculation: number = levellingConfig.TEXT_BASE_XP
			+ levellingConfig.TEXT_PER_CHAR_XP
			* Math.min(text.content.length, levellingConfig.TEXT_MAX_LENGTH),
		messageWorthAfterServerActivity: number =
			lengthCalculation * (
				Math.pow(levellingConfig.TEXT_FUNC_EXP_BASE,
					server_activity
					/ levellingConfig.TEXT_FUNC_CONST_A
					+ levellingConfig.TEXT_FUNC_OFFSET_X)
				+ levellingConfig.TEXT_FUNC_OFFSET_Y),
		messageWorthAfterUserActivity: number =
			messageWorthAfterServerActivity
			* (1 - personalActivityPenalty(user_activity_daily, user_activity_weekly));
	if (!timeofdayPenalty(daytime)) {
		return messageWorthAfterUserActivity;
	} else {
		return Math.min(messageWorthAfterUserActivity, messageWorthAfterServerActivity, lengthCalculation);
	}
}

/**
 * Check, if the current time is within a lockdown period
 * @param daytime the time of day, from 0 to 1439 minutes (24h * 60m)
 */
function timeofdayPenalty(daytime: number): boolean {
	if (daytime < 0 || daytime >= 1440) throw new RangeError("Invalid time of day");
	for (const lockdown of levellingConfig.TEXT_LOCKDOWNS) {
		if (daytime >= lockdown[0] && daytime < lockdown[1]) {
			return true;
		}
	}
	return false;
}

/**
 * Calculate the personal activity penalty for a user
 * @param user_activity_daily number of messages from the user in the last DAY / 24h / 1440m
 * @param user_activity_weekly number of messages from the user in the last WEEK / 7d / 168h / 10080m
 */
function personalActivityPenalty(user_activity_daily: number, user_activity_weekly: number): number {
	const dailyPenalty =
		user_activity_daily < levellingConfig.TEXT_FALLOFF_DAILY_START ? levellingConfig.TEXT_FALLOFF_DAILY_FROM :
			user_activity_daily > levellingConfig.TEXT_FALLOFF_DAILY_END ? levellingConfig.TEXT_FALLOFF_DAILY_TO :
				(Math.abs(levellingConfig.TEXT_FALLOFF_DAILY_END - user_activity_daily) / Math.abs(levellingConfig.TEXT_FALLOFF_DAILY_END - levellingConfig.TEXT_FALLOFF_DAILY_START)) * Math.abs(levellingConfig.TEXT_FALLOFF_DAILY_FROM - levellingConfig.TEXT_FALLOFF_DAILY_TO);
	const weeklyPenalty =
		user_activity_weekly < levellingConfig.TEXT_FALLOFF_WEEKLY_START ? levellingConfig.TEXT_FALLOFF_WEEKLY_FROM :
			user_activity_weekly > levellingConfig.TEXT_FALLOFF_WEEKLY_END ? levellingConfig.TEXT_FALLOFF_WEEKLY_TO :
				(Math.abs(levellingConfig.TEXT_FALLOFF_WEEKLY_END - user_activity_weekly) / Math.abs(levellingConfig.TEXT_FALLOFF_WEEKLY_END - levellingConfig.TEXT_FALLOFF_WEEKLY_START)) * Math.abs(levellingConfig.TEXT_FALLOFF_WEEKLY_FROM - levellingConfig.TEXT_FALLOFF_WEEKLY_TO);
	return Math.min(dailyPenalty, weeklyPenalty);
}