const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "ownerinfo",
    version: "6.0",
    author: "Huraira",
    countDown: 5,
    role: 0,
    description: "Show full details about the bot owner Watashi Sajib 💫",
    category: "info",
  },

  onStart: async function ({ message }) {
    try {
      // Basic info
      const time = moment.tz("Asia/Dhaka").format("hh:mm A, dddd, DD MMMM YYYY");
      const ownerName = "👑 𝗪𝗮𝘁𝗮𝘀𝗵𝗶 𝗦𝗮𝗷𝗶𝗯 👑";
      const fbUID = "100078792977084";
      const prefix = "+";
      const botName = "🐥 𝑴𝒂𝒉𝒊𝒓𝒖 𝑪𝒉𝒂𝒏 🐥";

      // Banner image
      const bannerUrl = "https://i.ibb.co/cY3VNpg/mahiru-banner.jpg"; // Changeable
      const imagePath = __dirname + "/cache/ownerinfo.jpg";

      const response = await axios.get(bannerUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      const info = `
🌸 ━━━ 『 ${botName} 』 ━━━ 🌸

💫 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 💫
👑 Name: ${ownerName}
🪪 FB UID: ${fbUID}
🌍 Country: Bangladesh 🇧🇩
💻 Profession: Developer & Creator
🕐 Local Time: ${time}

🔗 𝗦𝗢𝗖𝗜𝗔𝗟 𝗟𝗜𝗡𝗞𝗦:
📘 Facebook: https://facebook.com/profile.php?id=${fbUID}
🪄 GitHub: https://github.com/WatashiSajib
💌 Telegram: https://t.me/WatashiSajib

🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢:
🐤 Bot Name: ${botName}
⚙️ Prefix: ${prefix}
🧠 System: GoatBot v2 | Node.js
🩵 Status: Online & Running Perfectly

✨ “Even in silence, code speaks for the creator.” 💻
──────────────────────
⚡ 𝗢𝗪𝗡𝗘𝗥: ${ownerName}
──────────────────────
`;

      return message.reply({
        body: info,
        attachment: fs.createReadStream(imagePath),
      });
    } catch (err) {
      console.error(err);
      return message.reply("⚠️ | Couldn't load owner info, please try again later!");
    }
  },
};
