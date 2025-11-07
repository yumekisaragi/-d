// info.js
module.exports = {
  name: "info",
  description: "Show info about a person or the bot. Usage: +info or +info name",
  execute(api, event, args) {
    const who = args.join(" ") || "this chat";
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    if (who === "this chat") {
      const msg = `ℹ️ Chat Info\n- Thread ID: ${event.threadID}\n- Time: ${now}\n- Prefix: +\nUse +owner to see bot owner.`;
      return api.sendMessage(msg, event.threadID, event.messageID);
    } else {
      // fun generated info
      const traits = ["kind", "funny", "smart", "shy", "creative"];
      const pick = traits[Math.floor(Math.random() * traits.length)];
      api.sendMessage(`Info about ${who}:\n- Trait: ${pick}\n- Favorite color: Blue-ish 💙\n- Horoscope: Chill`, event.threadID, event.messageID);
    }
  }
};
