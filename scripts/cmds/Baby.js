const fs = require("fs-extra");
const path = require("path");

const DATA_PATH = path.join(__dirname, "/cache/babyReplies.json");

module.exports = {
  config: {
    name: "baby",
    version: "6.0",
    author: "Watashi Sajib",
    countDown: 3,
    role: 0,
    description: "Cute baby auto-reply with teach system (Bangla + English)",
    category: "fun",
  },

  onStart: async function ({ message, args }) {
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({ bangla: {}, english: {} }));
    const data = JSON.parse(fs.readFileSync(DATA_PATH));

    // Teach system
    if (args[0]?.toLowerCase() === "teach") {
      const content = args.slice(1).join(" ");
      if (!content.includes("="))
        return message.reply("Use: +baby teach <trigger> = <reply>\nExample: +baby teach I love you = I love you too 💖");

      const [trigger, reply] = content.split("=").map(e => e.trim());
      if (!trigger || !reply) return message.reply("Both trigger and reply required!");

      const isBangla = /[অ-ঔক-হ]/.test(trigger);
      const langKey = isBangla ? "bangla" : "english";

      data[langKey][trigger.toLowerCase()] = reply;
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));

      return message.reply(`🍼 Learned successfully!\n"${trigger}" ➜ "${reply}"`);
    }

    // Info
    return message.reply("💖 Baby system active! Say something with 'baby' to get a reply.\nTeach new replies:\n+baby teach <trigger> = <reply>");
  },

  onChat: async function ({ event, message }) {
    const text = event.body?.toLowerCase();
    if (!text) return;
    if (!text.includes("baby") && !text.includes("বেবি")) return;

    if (!fs.existsSync(DATA_PATH)) return;
    const data = JSON.parse(fs.readFileSync(DATA_PATH));

    const lang = /[অ-ঔক-হ]/.test(text) ? "bangla" : "english";

    // Learned reply check
    for (const key of Object.keys(data[lang])) {
      if (text.includes(key)) return message.reply(data[lang][key]);
    }

    // Default replies
    const repliesEN = ["Hehe yes baby? 💞","Hmm tell me baby 🥰","I’m here for you 💋","Yes baby~ what happened? 😳","UwU I’m listening, my baby 💖"];
    const repliesBN = ["হেহে হ্যাঁ বেবি? 💞","হুম আমাকে বলো বেবি 🥰","আমি এখানে আছি 💋","হ্যাঁ বেবি~ কি হয়েছে? 😳","উউউ, আমি শুনছি, আমার বেবি 💖"];

    const reply = lang === "bangla" ? repliesBN[Math.floor(Math.random()*repliesBN.length)] : repliesEN[Math.floor(Math.random()*repliesEN.length)];

    return message.reply(reply);
  }
};
