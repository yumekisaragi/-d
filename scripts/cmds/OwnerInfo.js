module.exports = {
  config: {
    name: "ownerinfo",
    aliases: ["owner", "ownerinfo"],
    version: "1.1",
    author: "Watashi Sajib 💫",
    countDown: 3,
    role: 0,
    shortDescription: "Show Owner's full info with social links",
    longDescription: "Displays owner name, FB, Instagram, Age, Study, Relationship",
    category: "info",
    guide: "{p}ownerinfo"
  },

  onStart: async function ({ api, event }) {
    try {
      // Dynamic Owner Info
      const owner = {
        name: "𝐖𝐚𝐭𝐚𝐬𝐡𝐢 𝐒𝐚𝐣𝐢𝐛 ✦√",
        fb: "https://www.facebook.com/share/16WZtvPKJY/",
        insta: "https://www.instagram.com/itzsajib78?igsh=MTd6Zm1qc3BvdGM4dQ==",
        study: "𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡 𝐎𝐩𝐞𝐧 𝐔𝐧𝐢𝐯𝐞𝐫𝐬𝐢𝐭𝐲 𝐜𝐥𝐚𝐬𝐬 10 𝐅𝐢𝐫𝐬𝐭 𝐘𝐞𝐚𝐫f ",
        age: "18+",
        relationship: "𝐈𝐝𝐤"
      };

      const msg = `
🌸┏━━━━━━━━━━━━━━━┓🌸
💖 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨 💖
🌸┗━━━━━━━━━━━━━━━┛🌸

🦋 Name: ${owner.name}
🔗 Facebook: ${owner.fb}
📸 Instagram: ${owner.insta}
🎓 Study: ${owner.study}
🎂 Age: ${owner.age}
💖 Relationship: ${owner.relationship}

──────────────────────
🌼 From: ${owner.name}
──────────────────────
`;

      return api.sendMessage(msg, event.threadID);
    } catch (err) {
      return api.sendMessage("❌ Unexpected Error: " + err.message, event.threadID);
    }
  }
};
