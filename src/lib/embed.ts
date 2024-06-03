import {Colors, EmbedBuilder} from "discord.js";

export function voiceEmbed(message: string, color?: keyof typeof Colors) {
	return new EmbedBuilder()
		.setTitle("Voice Manager")
		.setColor(color || "Blue")
		.setDescription(message);
}

export function succesEmbed(message: string) {
	return new EmbedBuilder()
		.setTitle("Erfolgreich")
		.setColor("Green")
		.setDescription(message);
}
