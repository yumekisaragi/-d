const fs = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");

const dataFile = path.join(__dirname, "../../data/babyReplies.json");

// Ensure data file exists
if (!fs.existsSync(dataFile)) fs.writeJSONSync(dataFile, []);

module.exports = {
  config: {
    name: "baby",
    aliases: ["babe"],
    version: "3.0",
    author: "Watashi Sajib 💫",
    countDown: 3,
    role: 0,
    description: "Send a sweet reply when you call baby & learn new replies",
    category: "fun"
  },

  onStart: async function ({ message, args, event }) {
    try {
      const replies = fs.readJSONSync(dataFile);

      // Teach new phrase
      if (args[0] && args[0].toLowerCase() === "teach") {
        const textToTeach = args.slice(1).join(" ");
        if (!textToTeach) return message.reply("⚠️ Please provide text to teach.");
        replies.push(textToTeach);
        fs.writeJSONSync(dataFile, replies, { spaces: 2 });
        return message.reply(`✅ New baby phrase learned: "${textToTeach}"`);
      }

      // Random reply
      const time = moment.tz("Asia/Dhaka").format("hh:mm A, dddd, DD MMMM YYYY");
      const randomReply = replies.length > 0 ? replies[Math.floor(Math.random() * replies.length)] : "🥰 Baby says hi!";
      const msg = `
🌸┏━━━━━━━━━━━━━━━┓🌸
💖 𝐇𝐞𝐲 𝐁𝐚𝐛𝐲 💖
🌸┗━━━━━━━━━━━━━━━┛🌸

🕊️ আজ ${time}
${randomReply}

──────────────────────
🌼 From: Watashi Sajib
──────────────────────
`;
      return message.reply(msg);
    } catch (err) {
      return message.reply(`⚠️ Unexpected error: ${err.message}`);
    }
  }
};
