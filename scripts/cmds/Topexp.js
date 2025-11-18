module.exports = {
  config: {
    name: "topexp",
    version: "1.0",
    author: "Watashi Wa Sajib",
    countDown: 5,
    role: 0,
    category: "info",
    description: "Shows Top 10 users with highest EXP"
  },

  onStart: async ({ api, event, Currencies }) => {
    try {
      const allUsers = await Currencies.getAll();

      if (!allUsers || allUsers.length === 0) {
        return api.sendMessage("⚠️ No EXP data found!", event.threadID);
      }

      // Sort by EXP
      const top = allUsers
        .sort((a, b) => (b.exp || 0) - (a.exp || 0))
        .slice(0, 10);

      // ⭐ Fancy EXP Leaderboard ⭐
      let expList = "╭━━━〔 ⭐ 𝗧𝗢𝗣 𝟭𝟬 𝗘𝗫𝗣 𝗣𝗟𝗔𝗬𝗘𝗥𝗦 ⭐ 〕━━━╮\n\n";

      top.forEach((user, i) => {
        expList += `┃ ${i + 1}. UID: ${user.id}\n┃    🔥 EXP: ${user.exp || 0}\n\n`;
      });

      expList += "╰━━━━━━━━━━━━━━━━━━━━╯";

      api.sendMessage(expList, event.threadID, event.messageID);

    } catch (e) {
      console.log(e);
      api.sendMessage("⚠️ Error loading EXP leaderboard!", event.threadID);
    }
  }
};
