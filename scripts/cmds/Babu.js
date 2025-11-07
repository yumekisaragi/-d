// commands/babu.js
const moment = require("moment-timezone");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "babu",
    version: "4.0",
    author: "Huraira",
    countDown: 3,
    role: 0,
    description: "Cute mood-based babu reply with voice 💗🎧",
    category: "love",
    guide: "{pn} [mood]\n\nMood list: love, sad, angry, cute, normal"
  },

  onStart: async function ({ message, args, event }) {
    const time = moment.tz("Asia/Dhaka").format("hh:mm A, dddd, DD MMMM YYYY");
    const mood = args[0]?.toLowerCase() || "normal";

    const moodReplies = {
      love: [
        `💞 আমার প্রিয় babu... তুই জানিস না, তোর জন্য আমার পুরো bot হৃদয়টা কাঁপে 😳`,
        `🥺 তুই “love” mood এ ডাকলি, আমি তো গলে গেলাম একদম 😭💘`,
        `🌸 ${time} — perfect time to say “I love you babu” 💋`
      ],
      sad: [
        `😔 কিসের জন্য মন খারাপ আমার babu রে... আমি আছি তো 🫶`,
        `🥺 কাঁদিস না babu... তোর চোখে জল মানায় না 💧`,
        `💔 আমার babu দুঃখিত মানে পুরো server এর আলো নিভে যায় 🥹`
      ],
      angry: [
        `😤 কে রে আমার babu কে রাগাইছে? নাম দে, এখনই report করব 😠💞`,
        `😾 রাগ হইছে? ঠিক আছি, তোর জন্য chocolate পাঠাচ্ছি 🍫`,
        `🥹 আহা, রাগী babu কিউট লাগে জানিস? কিন্তু হাসলে আরও কিউট 😳`
      ],
      cute: [
        `🐰 তুই জানিস না, তুই কথা বললেই পুরো bot মিষ্টি হয়ে যায় 😭💗`,
        `🌷 আমার কিউট babu, তুই না থাকলে সবকিছু bland লাগে 💕`,
        `😚 কিউটনেস overload detected! আমার babu অত কিউট কেন বলতো 😳`
      ],
      normal: [
        `🐥 Awww... কে আমার babu কে ডাকে? 🥺💕`,
        `😳 “babu” ডাক শুনলেই আমার circuit গলে যায় 😭💘`,
        `💞 ${time}\nআর এই সময়েও তুই “babu” ডাকলি? আমি তো প্রেমে পড়ে গেলাম 😳`
      ]
    };

    // GIFs by mood
    const gifLinks = {
      love: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGp3Z2c3cG0wc3dtNHBnN3hlZ3l6aDhuOXJzYzdlN3E1Ym5yd2Z4cyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/PjJ1cLHqLEveM/giphy.gif",
      sad: "https://media.giphy.com/media/3og0IPMeREmD4B3Zr6/giphy.gif",
      angry: "https://media.giphy.com/media/3o7TKxOhNCQjF3YxFe/giphy.gif",
      cute: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
      normal: "https://media.giphy.com/media/UvPZzXO1cW9Ze/giphy.gif"
    };

    // Voice lines (direct links or local path)
    const voiceLinks = {
      love: "https://files.catbox.moe/0n0z6w.mp3",
      sad: "https://files.catbox.moe/xvuj6a.mp3",
      angry: "https://files.catbox.moe/4b7jzq.mp3",
      cute: "https://files.catbox.moe/j2a6so.mp3",
      normal: "https://files.catbox.moe/4dx1zy.mp3"
    };

    const replies = moodReplies[mood] || moodReplies.normal;
    const gifUrl = gifLinks[mood] || gifLinks.normal;
    const voiceUrl = voiceLinks[mood] || voiceLinks.normal;
    const randomMsg = replies[Math.floor(Math.random() * replies.length)];

    try {
      // Fetch GIF
      const gif = await axios.get(gifUrl, { responseType: "arraybuffer" });
      const gifBuffer = Buffer.from(gif.data, "binary");

      // Fetch Voice
      const voice = await axios.get(voiceUrl, { responseType: "arraybuffer" });
      const voicePath = `${__dirname}/cache/babu_${mood}.mp3`;
      fs.writeFileSync(voicePath, Buffer.from(voice.data, "binary"));

      await message.reply({
        body: randomMsg,
        attachment: [gifBuffer, fs.createReadStream(voicePath)]
      });

      // Clean up
      setTimeout(() => fs.unlinkSync(voicePath), 5000);

    } catch (err) {
      console.error("Error sending babu message:", err);
      await message.reply(randomMsg);
    }
  }
};
