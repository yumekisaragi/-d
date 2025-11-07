const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "prefix",
    version: "3.0",
    author: "Watashi Sajib",
    countDown: 5,
    role: 0,
    description: "Show current prefix and bot info",
    category: "config"
  },

  onStart: async function ({ message, event }) {
    const prefix = global.GoatBot.config.prefix || "+";
    const time = moment.tz("Asia/Dhaka").format("hh:mm A, dddd, DD MMMM YYYY");

    const msg = `
🌸✨ 𝑯𝒆𝒚 𝑴𝒚 𝑳𝒐𝒗𝒆𝒍𝒚 𝑼𝒔𝒆𝒓 ✨🌸

🕰️ 𝐓𝐢𝐦𝐞: ${time}

💬 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐏𝐫𝐞𝐟𝐢𝐱: 「 ${prefix} 」
💎 𝐁𝐨𝐭 𝐍𝐚𝐦𝐞: 𝑴𝒂𝒉𝒊𝒓𝒖 𝑪𝒉𝒂𝒏 💖
👑 𝐎𝐰𝐧𝐞𝐫: 𝑾𝒂𝒕𝒂𝒔𝒉𝒊 𝑺𝒂𝒋𝒊𝒃 🌙

──────────────────────
💌 Example:
${prefix}help
${prefix}pair
${prefix}owner
──────────────────────

✨ Stay positive, stay lovely 💖
`;

    return message.reply(msg);
  }
};
