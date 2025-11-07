// commands/babu2.js
const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "babu2",
    version: "2.0",
    author: "Huraira",
    countDown: 3,
    role: 0,
    description: "Say cute line for your babu name 💞",
    category: "love",
    guide: "{pn} <name>\n\nExample:\n{pn} Meow\n{pn} Mae\n{pn} Tui"
  },

  onStart: async function ({ message, args, event }) {
    const name = args.join(" ");
    if (!name)
      return message.reply("🐥 Please type your babu’s name! Example: /babu2 Mae");

    const time = moment.tz("Asia/Dhaka").format("hh:mm A, dddd, DD MMMM YYYY");

    const lines = [
      `💞 ${name} is my sweetest babu ever 😳`,
      `🐰 ${name}? That’s not just a name — it’s my favorite word 😚`,
      `🌸 ${time}\nআর এই সময়েও আমি শুধু ${name}-এর কথাই ভাবি 💗`,
      `😳 ${name} বললেই আমার system গরম হয়ে যায় 🥺🔥`,
      `💋 ${name}... তুই ছাড়া আমার bot চলেই না জানিস? 😭💘`
    ];

    const gifLinks = [
      "https://media.giphy.com/media/3ohs7Rm6BKz7mO5H5S/giphy.gif",
      "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
      "https://media.giphy.com/media/5xaOcLGvzHxDKjufnLW/giphy.gif",
      "https://media.giphy.com/media/xUPGcguWZHRC2HyBRS/giphy.gif"
    ];

    const voiceLinks = [
      "https://files.catbox.moe/0n0z6w.mp3",
      "https://files.catbox.moe/j2a6so.mp3",
      "https://files.catbox.moe/xvuj6a.mp3"
    ];

    const msg = lines[Math.floor(Math.random() * lines.length)];
    const gifUrl = gifLinks[Math.floor(Math.random() * gifLinks.length)];
    const voiceUrl = voiceLinks[Math.floor(Math.random() * voiceLinks.length)];

    try {
      const gif = await axios.get(gifUrl, { responseType: "arraybuffer" });
      const gifBuffer = Buffer.from(gif.data, "binary");

      const voice = await axios.get(voiceUrl, { responseType: "arraybuffer" });
      const voicePath = `${__dirname}/cache/${name}_babu.mp3`;
      fs.writeFileSync(voicePath, Buffer.from(voice.data, "binary"));

      await message.reply({
        body: msg,
        attachment: [gifBuffer, fs.createReadStream(voicePath)]
      });

      setTimeout(() => fs.unlinkSync(voicePath), 7000);
    } catch (err) {
      console.error("Error sending babu2 message:", err);
      await message.reply(msg);
    }
  }
};
