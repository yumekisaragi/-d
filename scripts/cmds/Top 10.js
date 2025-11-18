module.exports = {
  config: {
    name: "top10",
    version: "2.0",
    author: "Watashi Wa Sajib",
    countDown: 5,
    role: 0,
    category: "info",
    description: "Shows Top 10 richest users"
  },

  onStart: async ({ api, event, Currencies }) => {
    try {
      const allUsers = await Currencies.getAll(); // fetch all users with money
      if (!allUsers || allUsers.length === 0) {
        return api.sendMessage("⚠️ No data found for leaderboard!", event.threadID);
      }

      // Sort by money (descending)
      const top = allUsers
        .sort((a, b) => b.money - a.money)
        .slice(0, 10);

      let rankList = "╭━━━〔 🏆 𝗧𝗢𝗣 𝟭𝟬 𝗣𝗟𝗔𝗬𝗘𝗥𝗦 〕━━━╮\n\n";
top.forEach((user, i) => {
  rankList += `┃ ${i + 1}. UID: ${user.id}\n┃    💰 Money: ${user.money}\n\n`;
});
rankList += "╰━━━━━━━━━━━━━━━━━━━━╯";

      top.forEach((user, i) => {
        rankList += `${i + 1}. UID: ${user.id}\n   💰 Money: ${user.money}\n\n`;
      });

      api.sendMessage(rankList, event.threadID, event.messageID);

    } catch (e) {
      console.log(e);
      api.sendMessage("⚠️ Error loading top 10 leaderboard!", event.threadID);
    }
  }
};
