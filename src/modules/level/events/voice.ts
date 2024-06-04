import {Events} from "discord.js";
import {client} from "../../../bot";
import {addUserExperience} from "../addUserExperience";
import {levellingConfig, timeofdayPenalty} from "../levelHelper";

const currentUserInVoice: { [key: string]: VoiceMode } = {};
const voiceIntervals: { [key: string]: NodeJS.Timeout } = {};
const voiceDuration: { [key: string]: number } = {};

/**
 * Initialize the voice levelling system
 * Important: Call this function exactly once on bot setup
 */
export async function initXPVoiceEvaluator() {
	client.on(Events.VoiceStateUpdate, (before, after) => {
		const user = before.member || after.member;

		// If user is not supplied or is a bot, return
		if (!user) return;

		// If user joined a voice channel
		if (after.channelId) {

			// Assign mute state
			if (after.deaf) currentUserInVoice[user.id] = VoiceMode.ZERO;
			else if (after.mute) currentUserInVoice[user.id] = VoiceMode.HALF;
			else currentUserInVoice[user.id] = VoiceMode.FULL;

			// Add interval if not already added
			if (!voiceIntervals[user.id]) {
				voiceIntervals[user.id] = setInterval(() => {

					// If user is not in voice, clear and remove interval
					if (!currentUserInVoice[user.id]) {
						clearInterval(voiceIntervals[user.id]);
						delete voiceIntervals[user.id];
						return;
					}
					const timeofday: number = new Date().getHours() * 60 + new Date().getMinutes();
					// Add XP based on mute state
					if (currentUserInVoice[user.id] == VoiceMode.FULL) {
						addUserExperience(user, levellingConfig.VOICE_UNMUTE_MULTIPLIER * levellingConfig.VOICE_PER_MINUTE_BASE_EXP * (timeofdayPenalty(timeofday) ? 0 : 1));
					} else if (currentUserInVoice[user.id] == VoiceMode.HALF) {
						addUserExperience(user, levellingConfig.VOICE_MUTE_MULTIPLIER * levellingConfig.VOICE_PER_MINUTE_BASE_EXP * (timeofdayPenalty(timeofday) ? 0 : 1));
					} else {
						addUserExperience(user, levellingConfig.VOICE_DEAF_MULTIPLIER * levellingConfig.VOICE_PER_MINUTE_BASE_EXP * (timeofdayPenalty(timeofday) ? 0 : 1));
					}
				}, 60 * 1000);
			}
		} else { // If user left a voice channel
			// Remove interval and delete user from currentUserInVoice
			delete currentUserInVoice[user.id];
			if (voiceIntervals[user.id]) {
				clearInterval(voiceIntervals[user.id]);
				delete voiceIntervals[user.id];
			}
		}
	});
}

/**
 * Deinitialize the voice levelling system
 * Call this for reinitialization.
 */
export function clearVoiceLevelling() {
	Object.keys(voiceIntervals).forEach(key => {
		clearInterval(voiceIntervals[key]);
		delete voiceIntervals[key];
	});
	Object.keys(currentUserInVoice).forEach(key => delete currentUserInVoice[key]);
	Object.keys(voiceDuration).forEach(key => delete voiceDuration[key]);
}

enum VoiceMode {
	FULL = "full",
	HALF = "half",
	ZERO = "zero",
}
