// commands/slap.js
const axios = require("axios");
const fs = require("fs-extra');
const path = require("path");

module.exports = {
  config: {
    name: "slap",
    version: "4.0",
    author: "Watashi Sajib",
    countDown: 5,
    role: 0,
    description: "Slap someone by mention with random slap image (Bangla/English replies)",
    category: "fun",
  },

  // helper: detect Bangla characters in a string
  isBangla(text) {
    return /[ঀ-ঃঅ-ঔক-হঢ়য়]/.test(text);
  },

  slapImages: [
    "https://i.imgur.com/oM3VtXv.gif",
    "https://i.imgur.com/vX9Q7Xc.gif",
    "https://i.imgur.com/DRK2qFb.gif",
    "https://i.imgur.com/OGfR3Rm.gif",
    "https://i.imgur.com/Qh5bVgV.gif",
    "https://i.imgur.com/Qh5bVgV.gif"
  ],

  onStart: async function ({ api, event, message }) {
    try {
      // Ensure mentions exist
      const mentions = event.mentions;
      if (!mentions || Object.keys(mentions).length === 0) {
        return message.reply("⚠️ Please mention someone to slap! Example: +slap @user");
      }

      // Choose first mentioned user as the target
      const mentionedIds = Object.keys(mentions);
      const targetId = mentionedIds[0];
      const targetName = mentions[targetId] || "Target";

      // Get sender info (best-effort)
      const senderId = event.senderID || event.author || null;
      let senderName = event.senderName || "Someone";
      try {
        if (api && senderId && !senderName) {
          const info = await api.getUserInfo(senderId);
          if (info && info[senderId] && info[senderId].name) senderName = info[senderId].name;
        }
      } catch (e) {
        // ignore, we already have fallback name
      }

      // Prevent self-slap
      if (senderId && targetId && senderId.toString() === targetId.toString()) {
        const selfMsg = this.isBangla(senderName + " " + targetName)
          ? "😅 নিজের ওপরেই ছোঁড়ো? তুমি তো নিজেই! (Self-slap not allowed) "
          : "😅 You can't slap yourself! Try tagging someone else.";
        return message.reply(selfMsg);
      }

      // Decide language by presence of Bangla in the original message or target/sender name
      const langBangla = this.isBangla(event.body || senderName || targetName);

      // Compose reply
      const bodyText = langBangla
        ? `💥 ${senderName} ${targetName}-কে এক চপ্পল মারল! 😳`
        : `💥 ${senderName} slapped ${targetName} 😳`;

      // Pick random slap image
      const imageUrl = this.slapImages[Math.floor(Math.random() * this.slapImages.length)];

      // Fetch image and save to cache
      const tmpDir = path.join(__dirname, "cache");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

      const filePath = path.join(tmpDir, `slap_${Date.now()}.gif`);
      const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(imageResp.data, "binary"));

      // Send message with attachment
      await message.reply({
        body: bodyText,
        attachment: fs.createReadStream(filePath)
      });

      // Clean up file
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
      }, 3000);
    } catch (err) {
      console.error("slap.js error:", err);
      return message.reply("⚠️ Could not perform slap. Try again later!");
    }
  }
};
