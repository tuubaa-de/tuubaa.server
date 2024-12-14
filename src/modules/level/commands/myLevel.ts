import {AttachmentBuilder, EmbedBuilder,} from "discord.js";
import {SlashInteraction} from "../../../types/commands";
import {createCanvas, loadImage} from "canvas";
import {LevelDatabase} from "../database";
import {RankCard} from "rankcard";
import {calcLevel, xpFromThisLevel, xpToNextLevel} from "../levelHelper";
import {SlashCommandPermissionsBuilder} from "../../../models/slashCommandBuilder";
import {snowflake} from "../../../lib/snowflake";

export const myLevel = {

	data: new SlashCommandPermissionsBuilder()
		.setName("level")
		.setDescription("Zeigt dein Level an.")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Der Benutzer, dessen Level angezeigt werden soll.")
		),
	async execute(interaction: SlashInteraction) {
		if (interaction.channelId !== snowflake.channels.bot?.id) {
			await interaction.deferReply({ephemeral: true});
		} else {
			await interaction.deferReply({ephemeral: false});
		}

		let user = interaction.options.getUser("user");

		if (!user) {
			user = interaction.user;
		}

		const levelData = await LevelDatabase.getXP(user.id);

		const allLevelData = await LevelDatabase.getAllXP();

		const index = levelData
			? allLevelData.indexOf(
			allLevelData.find((data) => data.userId == levelData.userId)!
		) + 1
			: "##";

		const xp = Math.round(levelData?.dezixp || 0);

		const level = calcLevel(xp);
		const currentXp = xpFromThisLevel(xp);
		const requiredXp = currentXp + xpToNextLevel(xp);

		const progress = (currentXp / requiredXp) * 100;

		const card = new RankCard()
			.setName(`${user.displayName}`)
			.setLevel(`Level ${level}`)
			.setColor("auto")
			.setBrightness(69)
			.setAvatar(user.avatarURL()!)
			.setProgress(progress)
			.setRank(index.toString())
			.setCurrentXp(`${Math.floor(currentXp / 10)}`)
			.setRequiredXp(`${Math.floor(requiredXp / 10)}`)
			.setShowXp(true);

		const embed = new EmbedBuilder().setImage("attachment://awesome.png");

		const attachment23 = new AttachmentBuilder(await card.build(), {
			description: "This is awesome",
			name: "awesome.png",
		});

		await interaction.editReply({
			// embeds: [embed],
			files: [attachment23],
		});

		return;

		const image = await loadImage(
			interaction.user.displayAvatarURL({extension: "png"})
		);

		const avaterCanvas = createCanvas(100, 100);
		const avatarCtx = avaterCanvas.getContext("2d");

		const circle = {
			x: avaterCanvas.width / 2,
			y: avaterCanvas.height / 2,
			radius: 50,
			startAngle: 0,
			endAngle: Math.PI * 2,
			anticlockwise: true,
		};

		avatarCtx.beginPath();
		avatarCtx.arc(
			circle.x,
			circle.y,
			circle.radius,
			circle.startAngle,
			circle.endAngle,
			circle.anticlockwise
		);
		avatarCtx.closePath();
		avatarCtx.clip();

		const aspect = image.height / image.width;
		const hsx = circle.radius * Math.max(1.0 / aspect, 1.0);
		const hsy = circle.radius * Math.max(aspect, 1.0);

		avatarCtx.drawImage(
			image,
			circle.x - hsx,
			circle.y - hsy,
			hsx * 2,
			hsy * 2
		);

		avatarCtx.beginPath();
		avatarCtx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
		avatarCtx.closePath();
		avatarCtx.strokeStyle = "white";
		avatarCtx.lineWidth = 5;
		avatarCtx.stroke();

		const canvas = createCanvas(600, 100);
		const ctx = canvas.getContext("2d");

		ctx.font = "30px Sans";
		ctx.fillStyle = "white";
		ctx.fillText(interaction.user.displayName, 110, 30);
		ctx.fillText(`Level: ${calcLevel(levelData?.dezixp || 0)}`, 110, 60);
		ctx.fillText(`XP: ${levelData?.dezixp || 0}`, 300, 60);

		ctx.drawImage(avaterCanvas, 0, 0, 100, 100);

		const attachment = new AttachmentBuilder(canvas.toBuffer(), {
			name: "awesome.png",
			description: "This is awesome",
		});

		// const canvas = createCanvas(600, 200);
		// const ctx = canvas.getContext("2d");
		// ctx.font = "30px Sans";
		// ctx.fillText("Awesome!", 50, 100);

		// const image = await loadImage(
		//   interaction.user.displayAvatarURL({ extension: "png" })
		// );

		// ctx.drawImage(image, 200, 50, 100, 100);

		// const attachment = new AttachmentBuilder(canvas.toBuffer(), {
		//   name: "awesome.png",
		//   description: "This is awesome",
		// });

		await interaction.channel?.send({files: [attachment]});
	},

};
