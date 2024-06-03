import {AttachmentBuilder, Colors, EmbedBuilder, Events, User,} from "discord.js";
import {client} from "../../../bot";
import {Minimal} from "greetify";
import Vibrant from "node-vibrant";
import {snowflake} from "../../../lib/snowflake";
import im from "imagemagick";

const SOURCE = "src/modules/welcome/src/";
const OUTPUT = "src/modules/welcome/output/";
const ANIMATION = SOURCE + "rain.gif";

export function welcomeMessage() {
	client.on(Events.GuildMemberAdd, async (member) => {
		const mainColor = await Vibrant.from(
			member.displayAvatarURL({extension: "png"})
		).getPalette();

		const bilder = [
			"https://i.postimg.cc/cHXJyv1x/tuba3.png",
			"https://i.postimg.cc/FKXzjtn4/tuba2.png",
			"https://i.postimg.cc/02rzv0JL/tuba1.png",
		];

		const card = await Minimal({
			name: `${member.displayName}`,
			avatar: member.displayAvatarURL(),
			type: "Willkommen",
			backgroundImage: bilder[Math.floor(Math.random() * bilder.length)],
			message: `Du bist der ${snowflake.guild.memberCount} Member!`,
			nameColor: mainColor.Vibrant!.hex,
		});

		const image = new AttachmentBuilder(card)
			.setName("welcome.png")
			.setDescription("Willkommen!");

		const embed = new EmbedBuilder()
			.setImage("attachment://welcome.png")
			.setTitle("👋 Willkommen!")
			.setThumbnail(member.displayAvatarURL())
			.setColor(Colors.DarkGold).setDescription(`
        Heyyy ${member}! Willkommen auf **tuubaa's goldener Van** 🎉! Hier kannst du dich mit anderen austauschen, an Events teilnehmen und vieles mehr 🌟!
        
        Um unsere Community beizutreten, lese dir bitte die Regeln in ${snowflake.channels.rules} durch und akzeptiere sie 📜. Du kannst dich unter ${snowflake.channels.introduce} vorstellen und uns etwas über dich erzählen 🎤.

        Danach kannst den Server-Guide durchgehen um dich mit Server vertraut zu machen. 📚

        Wir haben auch einen Minecraft-Server, auf dem du mit anderen Mitgliedern spielen kannst 🎮! Für mehr Informationen, schau dir bitte die Nachrichten in ${snowflake.channels.minecraft} an 🌍.

        Wir freuen uns, dich in unserer Community begrüßen zu dürfen! 🥳

        Falls du Fragen hast, kannst du dich jederzeit an unser Team wenden. Erstelle einfach ein Ticket in ${snowflake.channels.support} und wir helfen dir so schnell wie möglich 🎫!
        `);

		await snowflake.channels.welcome?.send({
			embeds: [embed],
			files: [image],
		});
	});
}

async function convertImage(user: User) {
	return new Promise((resolve, reject) => {
		im.convert(
			[
				ANIMATION,
				"-coalesce",
				"null:",
				OUTPUT + user.username + ".png",
				"-compose",
				"dst_over",
				"-layers",
				"composite",
				// "-layers",
				// "-fuzz",
				// "2%",
				// "+dither",
				// "-remap",
				// ` \\( ${ANIMATION}[0] +dither -colors XX \\)`,
				// "-re",
				"-layers",
				"OptimizeFrame",
				// "optimize",
				"-fuzz",
				"7%",
				"-colors",
				"128",
				OUTPUT + user.username + ".gif",
			],
			function (err, stdout) {
				if (err) {
					console.log(err);
				}
				resolve(stdout);
			}
		);
	});
}
