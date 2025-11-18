const axios = require("axios");
const Canvas = require("canvas");
const fs = require("fs-extra");

module.exports.config = {
  name: "rank",
  version: "3.0",
  hasPermssion: 0,
  credits: "Mahiru Chan",
  description: "Rank card with theme (Bangla + English)",
  commandCategory: "user",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, Currencies, Users }) {
  try {
    const uid = event.senderID;

    // USER DATA
    const money = (await Currencies.getData(uid)).money || 0;
    const user = await Users.getData(uid);
    const exp = user.exp || 0;
    const level = Math.floor(exp / 500);
    const name = await Users.getNameUser(uid);

    // THEME URL (তোর ইচ্ছা হলে বদলাতে পারবি)
    const bgURL = "https://i.imgur.com/ZwQZ9vS.jpg";

    // PROFILE PHOTO
    const avatarURL = await api.getUserInfo(uid).then(info => info[uid].profileUrl);

    // LOAD IMAGES
    const bg = await Canvas.loadImage(bgURL);
    const avatar = await Canvas.loadImage(avatarURL);

    // CANVAS SETUP
    const canvas = Canvas.createCanvas(900, 500);
    const ctx = canvas.getContext("2d");

    // DRAW BG
    ctx.drawImage(bg, 0, 0, 900, 500);

    // AVATAR CIRCLE
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 160, 120, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 30, 40, 240, 240);
    ctx.restore();

    // TEXT STYLE
    ctx.font = "40px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10;

    // TEXTS
    ctx.fillText(`👤 Name: ${name}`, 300, 120);
    ctx.fillText(`💰 Money: ${money}`, 300, 190);
    ctx.fillText(`⭐ EXP: ${exp}`, 300, 260);
    ctx.fillText(`📈 Level: ${level}`, 300, 330);
    ctx.fillText(`🆔 UID: ${uid}`, 300, 400);

    // SAVE IMAGE TEMP
    const path = __dirname + `/rank_${uid}.png`;
    fs.writeFileSync(path, canvas.toBuffer());

    return api.sendMessage(
      { body: "🎴 Your Rank Card 💗", attachment: fs.createReadStream(path) },
      event.threadID,
      () => fs.unlinkSync(path)
    );

  } catch (err) {
    return api.sendMessage("⚠️ Error creating rank card!", event.threadID);
  }
};
