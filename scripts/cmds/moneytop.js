module.exports = {
  config: {
    name: "moneytop15",
    version: "1.0",
    author: "Watashi Wa Sajib",
    countDown: 5,
    role: 0,
    category: "info",
    description: "Shows Top 15 richest users (Money leaderboard)"
  },

  onStart: async ({ api, event, Currencies }) => {
    try {
      const allUsers = await Currencies.getAll();

      if (!allUsers || allUsers.length === 0) {
        return api.sendMessage("⚠️ No money data found!", event.threadID, event.messageID);
      }

      // Sort by money in descending order
      const top = allUsers
        .sort((a, b) => (b.money || 0) - (a.money || 0))
        .slice(0, 15);

      let moneyList = "╭━━━〔 💰 𝗧𝗢𝗣 𝟭𝟱 𝗥𝗜𝗖𝗛𝗘𝗦𝗧 𝗣𝗟𝗔𝗬𝗘𝗥𝗦 〕━━━╮\n\n";

      top.forEach((user, i) => {
        moneyList += `┃ ${i + 1}. UID: ${user.id}\n┃     💵 Money: ${user.money || 0}\n\n`;
      });

      moneyList += "╰━━━━━━━━━━━━━━━━━━━━━━╯";

      api.sendMessage(moneyList, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ Error loading Top 15 Money!", event.threadID, event.messageID);
    }
  }
};
