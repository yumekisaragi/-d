const axios = require("axios");
const fs = require("fs-extra");
const Canvas = require("canvas");
const path = require("path");

module.exports = {
  config: {
    name: "rank""rk",
    version: "3.0",
    author: "Watashi Wa Sajib",
    countDown: 5,
    role: 0,
    category: "info",
    shortDescription: "Anime rank card",
  },

  onStart: async ({ event, api }) => {
    try {
      const uid = event.senderID;
      const name = event.senderName;

      // Level Data (dummy example)
      const level = 5;
      const exp = 250;
      const nextExp = 500;

      // Anime Background
      const bgURL = "https://i.imgur.com/hfQ8H0H.jpeg";

      // ---- FIXED AVATAR URL ----
      const avatarURL =
        `https://graph.facebook.com/${uid}/picture?width=512&height=512`;

      // Load images
      const [avatarImg, bgImg] = await Promise.all([
        axios.get(avatarURL, { responseType: "arraybuffer" }),
        axios.get(bgURL, { responseType: "arraybuffer" })
      ]);

      // canvas
      const canvas = Canvas.createCanvas(1100, 500);
      const ctx = canvas.getContext("2d");

      const bg = await Canvas.loadImage(bgImg.data);
      const av = await Canvas.loadImage(avatarImg.data);

      // draw bg
      ctx.drawImage(bg, 0, 0, 1100, 500);

      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, 1100, 500);

      // avatar circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(250, 250, 150, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(av, 100, 100, 300, 300);
      ctx.restore();

      // name text
      ctx.font = "60px Arial";
      ctx.fillStyle = "#fff";
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00eaff";
      ctx.fillText(name, 450, 170);

      // level
      ctx.font = "40px Arial";
      ctx.shadowColor = "#ff00aa";
      ctx.fillText(`Level: ${level}`, 450, 250);

      // exp
      ctx.fillText(`EXP: ${exp} / ${nextExp}`, 450, 310);

      // progress bar
      const barX = 450, barY = 350, barW = 500, barH = 30;
      const fillW = (exp / nextExp) * barW;

      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(barX, barY, barW, barH);

      ctx.fillStyle = "#00ffa6";
      ctx.fillRect(barX, barY, fillW, barH);

      const filePath = path.join(__dirname, `rank_${uid}.png`);
      fs.writeFileSync(filePath, canvas.toBuffer());

      api.sendMessage(
        {
          body: "🎌 Your Anime Rank Card 💫",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath)
      );

    } catch (e) {
      api.sendMessage("⚠️ Rank card generate error! (Fixed Soon)", event.threadID);
      console.log("Rank Error:", e);
    }
  }
};
