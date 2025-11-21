module.exports = {
  config: {
    name: "unsend",
    version: "3.0",
    author: "Watashi Sajib",
    countDown: 3,
    role: 0,
    description: "Unsend messages by triggers (+u, +uns, emojis) safely",
    category: "fun",
  },

  triggers: ["+u", "+uns", "😡","!u"], // Add more triggers

  onStart: async function ({ message, event, api, role }) {
    try {
      const text = event.body || "";
      const matched = this.triggers.some(trigger => text.includes(trigger));

      if (!matched) return; // no trigger, do nothing

      // Self + admin restriction
      const senderID = event.senderID;
      const threadID = event.threadID;
      const messageID = event.messageID;

      if (!messageID) return;

      // Only allow sender or admin (role >=2) to unsend
      if (senderID === event.senderID || role >= 2) {
        await api.unsendMessage(messageID);
      } else {
        return message.reply("⚠️ You are not allowed to unsend this message!");
      }
    } catch (err) {
      console.error("unsend.js error:", err);
      return message.reply("⚠️ Could not unsend the message. Try again!");
    }
  },
};
