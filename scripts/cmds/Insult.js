module.exports = {
  name: "insult",
  description: "Random insult 😂🔥",
  author: "Mahiru Chan",

  execute(api, event) {
    const lines = [
      "Tui কি offline server? কেউ তোকে কখনো খুঁজে পায় না 😭",
      "Tor IQ এত কম, calculator o তোকে দেখে হেসে দেয় 🙂",
      "Tui এত innocent যে scammerরাও তোকে দেখে দয়া পায় 💀",
      "Tor কথা শুনলেই মনে হয় uninstall করি 😹"
    ];

    api.sendMessage(lines[Math.floor(Math.random() * lines.length)], event.threadID);
  }
};
