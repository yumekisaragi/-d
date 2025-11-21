const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "owner",
    version: "2.0",
    author: "Huraira",
    countDown: 3,
    role: 0,
    description: "Cinematic owner info for Watashi Sajib 👑",
    category: "info",
  },

  onStart: async function ({ message, api, event }) {
    try {
      const time = moment.tz("Asia/Dhaka").format("hh:mm A, dddd, DD MMMM YYYY");
      const ownerName = "𝐀𝐫𝐢𝐲𝐚𝐧 𝐀𝐡𝐚𝐦𝐞𝐝";
      const fbUID = "100092562682881";
      const botName = "✨ 𝐙𝐚𝐫𝐚 💫";
      const prefix = "+";

      // Optional banner image
      const bannerUrl = "https://i.ibb.co/cY3VNpg/mahiru-banner.jpg";
      const imagePath = __dirname + "/cache/owner.jpg";
      try {
        const res = await axios.get(bannerUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, Buffer.from(res.data, "binary"));
        await message.reply({ body: "💫 Loading Owner Info...", attachment: fs.createReadStream(imagePath) });
      } catch {
        await message.reply("💫 Loading Owner Info...");
      }

      // Cinematic info lines
      const lines = [
        `🌸 ━━━ 『 ${botName} 』 ━━━ 🌸`,
        `💫 OWNER INFO 💫`,
        `👑 Name: ${ownerName}`,
        `🪪 FB UID: ${fbUID}`,
        `🌍 Country: Bangladesh 🇧🇩`,
        `💻 Profession: Developer & Creator`,
        `🕐 Local Time: ${time}`,
        ``,
        `🔗 SOCIAL LINKS:`,
        `📘 Facebook: https://www.facebook.com/share/16N24wYssU/${fbUID}`,
        `🪄 GitHub:`,
        `💌 Telegram:`,
        ``,
        `🤖 BOT INFO:`,
        `🐤 Bot Name: ${botName}`,
        `⚙️ Prefix: ${prefix}`,
        `🧠 System: GoatBot v2 | Node.js`,
        `🩵 Status: Online & Running Perfectly`,
        ``,
        `✨ "Even in silence, code speaks for the creator."`,
        `──────────────────────`,
        `⚡ OWNER: ${ownerName}`,
        `──────────────────────`
      ];

      // Send each line with delay
      for (const line of lines) {
        await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 sec delay
        await api.sendMessage(line, event.threadID);
      }

    } catch (err) {
      console.error(err);
      await message.reply("⚠️ | Could not load owner info. Try again later!");
    }
  },
};
