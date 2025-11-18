module.exports = {
  name: "hack",
  description: "Fake funny hacking 🤣💀",
  author: "Mahiru Chan",

  execute(api, event) {
    const mention = Object.keys(event.mentions)[0] || null;

    const name = mention ? event.mentions[mention].replace("@", "") : "Target User";

    const msg = `🔍 Hacking ${name}...\n📡 Loading data...\n💀 Password found: "amar_dimaag_off_2025"`;

    api.sendMessage(msg, event.threadID);
  }
};
