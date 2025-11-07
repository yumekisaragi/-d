module.exports = {
  name: "info2",
  description: "🌸 Shows bot information and system status",
  author: "Mahiru Chan 💫",

  execute(api, event) {
    const msg = `
╭━━━💫『 𝑩𝒐𝒕 𝑰𝒏𝒇𝒐 』💫━━━╮
┃ 🤖 Bot Name: 𝑴𝒂𝒉𝒊𝒓𝒖 𝑪𝒉𝒂𝒏 𝑩𝒐𝒕
┃ 💠 Prefix: +
┃ 🌸 Version: 1.0.0
┃ ⚙️ Framework: GoatBot (Messenger AI)
┃ 💻 Language: Node.js (JavaScript)
┃ 📅 Updated: 07 November 2025
┃ 👑 Owner: 𝑴𝒂𝒉𝒊𝒓𝒖 𝑪𝒉𝒂𝒏 💫
┃ 💌 Contact: https://www.facebook.com/share/17YDaL2JE2/
╰━━━━━━━━━━━━━━━━━━━━━━╯
🌷 𝙈𝙖𝙙𝙚 𝙬𝙞𝙩𝙝 💖 𝙛𝙤𝙧 𝙡𝙤𝙫𝙚, 𝙢𝙪𝙨𝙞𝙘, 𝙖𝙣𝙙 𝙘𝙤𝙙𝙞𝙣𝙜 🎧
`;

    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
