import {EmbedBuilder} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import axios from "axios";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";

const rolePlayData = {
	pat: {
		title: "user1 streichelt user2! <:PatpatTuba:1120695389973123253>",
		title2: "user1 streichelt alle! <:PatpatTuba:1120695389973123253>",
		text: `user2, user1 streichelt dich! <:PatpatTuba:1120695389973123253>`,
		text2: "user1 streichelt alle! <:PatpatTuba:1120695389973123253>",
		description: "Streicheln!",
	},
	sad: {
		title: "user1 ist traurig! <:DepressedEMOTE:1226978508736172123>",
		title2: "user1 ist traurig! <:DepressedEMOTE:1226978508736172123>",
		text: `user2, user1 ist traurig wegen dir! <:DepressedEMOTE:1226978508736172123>`,
		text2: "user1 ist traurig! <:DepressedEMOTE:1226978508736172123>",
		description: "Traurig!",
	},
	scared: {
		title: "user1 ist ängstlich! <:tuubaa_w:1235347591709982813>",
		title2: "user1 hat Angst! <:tuubaa_w:1235347591709982813>",
		text: `user2, user1 hat Angst vor dir! <:tuubaa_w:1235347591709982813>`,
		text2: "user1 hat Angst! <:tuubaa_w:1235347591709982813>",
		description: "Ängstlich!",
	},
	shy: {
		title: "user1 ist schüchtern! <:tuubaa_verlegen_Emote:1236346476649513043>",
		title2:
			"user1 ist schüchtern! <:tuubaa_verlegen_Emote:1236346476649513043>",
		text: `user2, user1 ist schüchtern wegen dir! <:tuubaa_verlegen_Emote:1236346476649513043>`,
		text2: "user1 ist schüchtern! <:tuubaa_verlegen_Emote:1236346476649513043>",
		description: "Schüchtern!",
	},
	sleep: {
		title: "user1 schläft! <:SleepTuba:1123745924720627722>",
		title2: "user1 schläft! <:SleepTuba:1123745924720627722>",
		text: `user2, user1 schläft wegen dir! <:SleepTuba:1123745924720627722>`,
		text2: "user1 schläft! <:SleepTuba:1123745924720627722>",
		description: "Schlafen!",
	},
	smug: {
		title: "user1 ist eingebildet! <:TuubaaSmug:1224431019323687084>",
		title2: "user1 ist eingebildet! <:TuubaaSmug:1224431019323687084>",
		text: "user2, user1 ist wegen dir eingebildet! <:TuubaaSmug:1224431019323687084>",
		text2: "user1 ist eingebildet! <:TuubaaSmug:1224431019323687084>",
		description: "Eingebildet!",
	},
	yay: {
		title: "user1 sagt YIPPIE! <:TuubaaYay:1142165340827160587>",
		title2: "user1 sagt YIPPIE! <:TuubaaYay:1142165340827160587>",
		text: `user2, user1 YIPPIE! <:TuubaaYay:1142165340827160587>`,
		text2: "user1 sagt YIPPIE! <:TuubaaYay:1142165340827160587>",
		description: "YIPPIE!",
	},
	cuddle: {
		title: "user1 kuschelt mit user2! <:TuubaaSquish:1225857635958394951>",
		title2: "user1 kuschelt! <:TuubaaSquish:1225857635958394951>",
		text: `user2, user1 kuschelt mit dir! <:TuubaaSquish:1225857635958394951>`,
		text2:
			"user1 kuschelt mit sich selbst... <:TuubaaSquish:1225857635958394951>. Wenn du hilfe brauchst wir haben auch ein Therapie Channel!",
		description: "Kuscheln!",
	},
	nervous: {
		title: "user1 ist nervös! <:tuubaa_nervous:1242487594051309608>",
		title2: "user1 ist nervös! <:tuubaa_nervous:1242487594051309608>",
		text: `user2, user1 ist nervös wegen dir! <:tuubaa_nervous:1242487594051309608>`,
		text2: "user1 ist nervös! <:tuubaa_nervous:1242487594051309608>",
		description: "Nervös!",
	},
	no: {
		title: "user1 sagt NEIN! <:TuubaaNo:1142165294719176824>",
		title2: "user1 sagt NEIN! <:TuubaaNo:1142165294719176824>",
		text: `user2, user1 NEIN! <:TuubaaNo:1142165294719176824>`,
		text2: "user1 sagt NEIN! <:TuubaaNo:1142165294719176824>",
		description: "Nein!",
	},
	cheers: {
		title: "Prost user2! 🥂",
		title2: "Prost meine Freunde! 🥂",
		text: `user2, user1 stoßt mit dir an! 🥂`,
		text2: "Stoßt mit euch an! 🥂",
		description: "Stoße an! 🥂",
	},
	blush: {
		title: "user1 wird rot! <:TuubaaBlush:1236363380676100147>",
		title2: "user1 wird rot! <:TuubaaBlush:1236363380676100147>",
		text: `user2, user1 wird von dir rot! <:TuubaaBlush:1236363380676100147>`,
		text2: "user1 wird rot! <:TuubaaBlush:1236363380676100147>",
		description: "Werde rot!",
	},
	slap: {
		title: "user1 schlägt user2! <a:BonkTubaa:1087066789013368852>",
		title2: "user1 schlägt zu! <a:BonkTubaa:1087066789013368852>",
		text: `user2, user1 schlägt dich! <a:BonkTubaa:1087066789013368852>`,
		text2: "user1 schlägt um sich! <a:BonkTubaa:1087066789013368852>",
		description: "Schlag!",
	},
	cool: {
		title:
			"user2 ist cool! <:wowwirklich:1196825321761157170><:coolermoment2:1196824022130892830>",
		title2:
			"user1 ist cool! <:wowwirklich:1196825321761157170><:coolermoment2:1196824022130892830>",
		text: `user1 sagt dass du cool ist! <:wowwirklich:1196825321761157170><:coolermoment2:1196824022130892830>`,
		text2:
			"cool! <:wowwirklich:1196825321761157170><:coolermoment2:1196824022130892830>",
		description: "Cool!",
	},
	hug: {
		title: "Umarmung für user2! <:TuubaaSquish:1225857635958394951>",
		title2: "Umarmung! <:SleepyTuba:1120695781557538816>",
		text: `user2, user1 umarmt dich! <:TuubaaSquish:1225857635958394951>`,
		text2: "user1, umarmt sich selbst... <:SleepyTuba:1120695781557538816>",
		description: "Umarmung!",
	},
	cry: {
		title: "user1 weint! <:tuubaa_w:1235347591709982813>",
		title2: "user1 weint! <:tuubaa_w:1235347591709982813>",
		text: `user2, user1 weint wegen dir! <:tuubaa_w:1235347591709982813>`,
		text2: "user1 weint! <:tuubaa_w:1235347591709982813>",
		description: "Weinen!",
	},
	evillaugh: {
		title: "user1 lacht boshaft! <:TuubaaSmug:1224431019323687084>",
		title2: "user1 lacht boshaft! <:TuubaaSmug:1224431019323687084>",
		text: `user2, user1 lacht wegen dir mit voller Bosheit! <:TuubaaSmug:1224431019323687084>`,
		text2: "user1 lacht boshaft! <:TuubaaSmug:1224431019323687084>",
		description: "Boshaft lachen!",
	},
	facepalm: {
		title:
			"user1 schlägt sich auf die Stirn! <:tuba_facepalm:1243007086896484413>",
		title2:
			"user1 schlägt sich auf die Stirn! <:tuba_facepalm:1243007086896484413>",
		text: `user2, user1 schlägt sich wegen dir auf die Stirn! <:tuba_facepalm:1243007086896484413>`,
		text2:
			"user1 schlägt sich auf die Stirn! <:tuba_facepalm:1243007086896484413>",
		description: "Facepalm!",
	},
	happy: {
		title: "user1 ist glücklich! <:smile:1196828239319015504>",
		title2: "user1 ist glücklich! <:smile:1196828239319015504>",
		text: `user2, user1 ist glücklich wegen dir! <:smile:1196828239319015504>`,
		text2: "user1 ist glücklich! <:smile:1196828239319015504>",
		description: "Glücklich!",
	},
	laugh: {
		title: "user1 lacht! <:CursedLaughTuba:1085515265170743306>",
		title2: "user1 lacht! <:CursedLaughTuba:1085515265170743306>",
		text: `user2, user1 lacht mit dir! <:CursedLaughTuba:1085515265170743306>`,
		text2: "user1 lacht! <:CursedLaughTuba:1085515265170743306>",
		description: "Lachen!",
	},
	kiss: {
		title: "Kuss für user2! <:LoveTuba:1090372406897561791>",
		title2: "Kuss! <:LoveTuba:1090372406897561791>",
		text: `user2, user1 gibt dir einen Kuss! <:LoveTuba:1090372406897561791>`,
		text2: "user1 küsst sich selbst... 😔",
		description: "Kuss!",
	},
	love: {
		title: "user1 liebt user2! <:LoveTuba:1090372406897561791>",
		title2: "user1 liebt alle! <:LoveTuba:1090372406897561791>️",
		text: `user2, user1 liebt dich! <:LoveTuba:1090372406897561791>`,
		text2: "user1 liebt alle! <:LoveTuba:1090372406897561791>",
		description: "Liebe!",
	},
	mad: {
		title: "user1 ist sauer! <:Tuuba_Tsundere_angy:1230190320621453453>",
		title2: "user1 ist sauer! <:Tuuba_Tsundere_angy:1230190320621453453>",
		text: `user2, user1 ist sauer auf dich! <:Tuuba_Tsundere_angy:1230190320621453453>`,
		text2: "user1 ist sauer! <:Tuuba_Tsundere_angy:1230190320621453453>",
		description: "Sauer!",
	},
};

const command = new SlashCommandPermissionsBuilder()
	.setName("rp")
	.setDescription("Roleplay Befehle");

for (const [key, value] of Object.entries(rolePlayData)) {
	command.addSubcommand((subcommand) =>
		subcommand
			.setName(key)
			.setDescription(value.description)
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("Der User, mit dem interagiert werden soll")
			)
	);
}

export const rolePlay = {
	data: command,
	async execute(interaction: SlashInteraction) {
		await interaction.deferReply({ephemeral: false});
		const user1 = interaction.user;
		const user2 = interaction.options.getUser("user");

		const command = interaction.options.getSubcommand();

		const data = rolePlayData[command as keyof typeof rolePlayData];

		const result = await axios.get(
			`https://api.otakugifs.xyz/gif?reaction=${command}`
		);

		if (result.status !== 200) {
			await interaction.editReply(
				"Ein Fehler ist aufgetreten, bitte versuche es später erneut!"
			);
			return;
		}

		if (!user2) {
			const embed = new EmbedBuilder()
				.setTitle(data.title2.replace("user1", user1.displayName))
				.setDescription(data.text2.replace("user1", user1.toString()))
				.setColor("Random")
				.setImage(result.data.url)
				.setFooter({
					text: `Angefordert von ${user1.displayName}`,
					iconURL: user1.displayAvatarURL(),
				});

			await interaction.editReply({
				embeds: [embed],
			});

			return;
		}

		if (user1.id === user2.id) {
			const result = await axios.get(
				`https://api.otakugifs.xyz/gif?reaction=sad`
			);

			if (result.status !== 200) {
				await interaction.editReply(
					"Ein Fehler ist aufgetreten, bitte versuche es später erneut!"
				);
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle("Fehler in der Psycheeee!")
				.setDescription(
					`${user1} braucht Hilfe! Er hat versucht sich selbst zu *${command}*en!`
				)
				.setColor("Random")
				.setImage(result.data.url)
				.setFooter({
					text: `Angefordert von ${user1.displayName}`,
					iconURL: user1.displayAvatarURL(),
				});

			await interaction.editReply({
				embeds: [embed],
			});

			return;
		}

		await (await interaction.channel!.send(`${user2}`)).delete();

		const embed = new EmbedBuilder()
			.setTitle(
				data.title
					.replace("user1", user1.displayName)
					.replace("user2", user2.displayName)
			)
			.setDescription(
				data.text
					.replace("user1", user1.toString())
					.replace("user2", user2.toString())
			)
			.setColor("Random")
			.setImage(result.data.url)
			.setFooter({
				text: `Angefordert von ${user1.displayName}`,
				iconURL: user1.displayAvatarURL(),
			})
			.setAuthor({
				name: `${user2.displayName}`,
				iconURL: user2.displayAvatarURL(),
			});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
