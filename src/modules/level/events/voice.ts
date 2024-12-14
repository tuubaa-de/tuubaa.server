import {Events, GuildMember, VoiceBasedChannel} from "discord.js";
import {client} from "../../../bot";
import {addUserExperience} from "../addUserExperience";
import {levellingConfig, timeofdayPenalty} from "../levelHelper";

const isUserLonely: { [key: string]: boolean } = {};
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

		if (before.channel) checkChannelLonelyness(before.channel);
		if (after.channel) checkChannelLonelyness(after.channel);

		// If user joined a voice channel
		if (after.channelId && after.channel) {

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
					let exp;
					if (currentUserInVoice[user.id] == VoiceMode.FULL) {
						exp = levellingConfig.VOICE_UNMUTE_MULTIPLIER * levellingConfig.VOICE_PER_MINUTE_BASE_EXP * (timeofdayPenalty(timeofday) ? 0 : 1);
					} else if (currentUserInVoice[user.id] == VoiceMode.HALF) {
						exp = levellingConfig.VOICE_MUTE_MULTIPLIER * levellingConfig.VOICE_PER_MINUTE_BASE_EXP * (timeofdayPenalty(timeofday) ? 0 : 1);
					} else {
						exp = levellingConfig.VOICE_DEAF_MULTIPLIER * levellingConfig.VOICE_PER_MINUTE_BASE_EXP * (timeofdayPenalty(timeofday) ? 0 : 1);
					}
					addUserExperience(user, exp);
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

function checkChannelLonelyness(channel: VoiceBasedChannel) {
	const iterator = channel.members.values();
	let member: GuildMember;

	if (channel.members.filter(member => !(member.voice.mute || member.voice.deaf)).size <= 1) {
		while (member = iterator.next().value) {

			currentUserInVoice[member.id] = VoiceMode.ZERO;
		}
	} else {
		while (member = iterator.next().value) {
			// Assign mute state
			if (member.voice.deaf) currentUserInVoice[member.id] = VoiceMode.ZERO;
			else if (member.voice.mute) currentUserInVoice[member.id] = VoiceMode.HALF;
			else currentUserInVoice[member.id] = VoiceMode.FULL;
		}
	}
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
