const axios = require("axios");

module.exports = {
  config: {
    name: "rank",
    version: "4.0",
    author: "Watashi Wa Sajib",
    countDown: 5,
    role: 0,
    category: "info",
  },

  onStart: async ({ api, event, usersData }) => {
    try {
      const uid = event.senderID;
      const name = event.senderName;

      // ----- Fake Level System (You can connect DB later) -----
      const level = 4;
      const exp = 180;
      const nextExp = 350;

      // ----- Avatar URL -----
      const avatar = 
        `https://graph.facebook.com/${uid}/picture?width=512&height=512`;

      // ----- API RANK CARD (NO CANVAS NEEDED) -----
      const imgURL =
        `https://god-api.vercel.app/rank?avatar=${encodeURIComponent(avatar)}&name=${encodeURIComponent(name)}&level=${level}&exp=${exp}&next=${nextExp}`;

      const img = (await axios.get(imgURL, { responseType: "stream" })).data;

      api.sendMessage(
        {
          body: "🌸 Your Rank Card Ready, mmh 💋",
          attachment: img
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      api.sendMessage("⚠️ Error: Rank generate failed (API down)", event.threadID);
      console.log(err);
    }
  }
};
