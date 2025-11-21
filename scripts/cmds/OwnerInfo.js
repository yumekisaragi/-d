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
        name: "𝐀𝐫𝐢𝐲𝐚𝐧 𝐀𝐡𝐚𝐦𝐞𝐝",
        fb: "https://www.facebook.com/share/16N24wYssU/",
        insta: "https://www.instagram.com/velvet.with_grace?igsh=YWRqbGptM21lYmpz",
        study: "𝐔𝐠𝐚𝐧𝐝𝐚 𝐔𝐧𝐢𝐯𝐞𝐫𝐬𝐢𝐭𝐲 𝐁𝐢𝐨𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐜𝐬 𝟑𝐫𝐝 𝐘𝐞𝐚𝐫",
        age: "99+",
        relationship: 
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
