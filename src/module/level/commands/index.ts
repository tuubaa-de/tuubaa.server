import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { SlashInteraction } from "../../../types/commands";
import { createCanvas, loadImage } from "canvas";
import { LevelDatabase } from "../database";

export const myLevel = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Zeigt dein Level an."),
  async execute(interaction: SlashInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const levelData = await LevelDatabase.getLevel(interaction.user.id);

    await interaction.channel?.send(
      `Level: ${levelData?.level || 0} XP: ${levelData?.xp || 0}`
    );

    return;

    const image = await loadImage(
      interaction.user.displayAvatarURL({ extension: "png" })
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
    ctx.fillText(`Level: ${levelData?.level || 0}`, 110, 60);
    ctx.fillText(`XP: ${levelData?.xp || 0}`, 300, 60);

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

    await interaction.channel?.send({ files: [attachment] });
  },
};
