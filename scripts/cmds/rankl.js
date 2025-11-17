const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "rank",
    version: "2.0",
    author: "Watashi Wa Sajib",
    countDown: 5,
    role: 0,
    shortDescription: "Anime style rank card",
    longDescription: "Shows beautiful anime rank card with avatar",
    category: "info",
  },

  onStart: async ({ event, api }) => {
    try {
      const uid = event.senderID;
      const name = event.senderName;

      // Example user level data
      const level = 7;
      const exp = 450;
      const nextExp = 700;

      // Anime Background URL
      const bgURL = "https://i.imgur.com/hfQ8H0H.jpeg"; // Anime aesthetic bg

      // Fetch avatar
      const avatarURL = await api.getUserInfo(uid).then(res => res[uid].profileUrl);
      const avatarImg = await axios.get(avatarURL, { responseType: "arraybuffer" });
      const backgroundImg = await axios.get(bgURL, { responseType: "arraybuffer" });

      // Canvas
      const canvas = Canvas.createCanvas(1100, 500);
      const ctx = canvas.getContext("2d");

      // Load Images
      const bg = await Canvas.loadImage(Buffer.from(backgroundImg.data));
      const av = await Canvas.loadImage(Buffer.from(avatarImg.data));

      // Draw Background
      ctx.drawImage(bg, 0, 0, 1100, 500);

      // Dark overlay
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, 1100, 500);

      // Avatar Circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(250, 250, 150, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(av, 100, 100, 300, 300);
      ctx.restore();

      // Glow Text Name
      ctx.font = "60px Arial";
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#ff00aa";
      ctx.shadowBlur = 25;
      ctx.fillText(name, 450, 180);

      // Level
      ctx.font = "40px Arial";
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#00eaff";
      ctx.fillText(`Level: ${level}`, 450, 260);

      // EXP
      ctx.fillText(`EXP: ${exp} / ${nextExp}`, 450, 320);

      // Progress Bar
      const barX = 450, barY = 350, barW = 500, barH = 30;
      const fillW = (exp / nextExp) * barW;

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(barX, barY, barW, barH);

      ctx.fillStyle = "#00ffa6";
      ctx.fillRect(barX, barY, fillW, barH);

      // Output
      const filePath = path.join(__dirname, `rank_${uid}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer());

      api.sendMessage(
        {
          body: "🎌 ANIME RANK CARD",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );

    } catch (e) {
      api.sendMessage("⚠ Rank card generate error!", event.threadID);
      console.error(e);
    }
  }
};
