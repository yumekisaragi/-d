// owner.js
module.exports = {
  name: "owner",
  description: "Show bot owner info. Usage: !owner",
  execute(api, event, args) {
    const ownerInfo = `
👑 BOT OWNER 👑
Name:𝐀𝐫𝐢𝐲𝐚𝐧 𝐀𝐡𝐚𝐦𝐞𝐝
FB: https://www.facebook.com/share/16N24wYssU/
GitHub: ** 😜💋💦
Prefix: !
`;
    api.sendMessage(ownerInfo, event.threadID, event.messageID);
  }
};
