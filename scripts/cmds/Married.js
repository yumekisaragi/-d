// married.js
module.exports = {
  name: "married",
  description: "Fun married status. Usage: +married name1 | name2",
  execute(api, event, args) {
    const text = args.join(" ");
    if (!text.includes("|")) return api.sendMessage("Usage: +married name1 | name2", event.threadID, event.messageID);
    const [a,b] = text.split("|").map(x=>x.trim());
    const years = Math.floor(Math.random() * 25) + 1;
    const msg = `💍 Married Prediction:\n${a} & ${b}\nWill be happily married for ${years} years ❤️\nTip: Communicate, laugh more!`;
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
