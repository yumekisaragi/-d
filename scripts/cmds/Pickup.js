module.exports = {
  name: "pickup",
  description: "Cute + Crazy pickup lines 😭❤️",
  author: "Mahiru Chan",

  execute(api, event) {
    const lines = [
      "Tui কি magnet? কাছে আসলেই হৃদয় টান্টে লাগে 🙂💗",
      "Tui কি google? কারণ আমি যেটা খুঁজি সব তোর মাঝেই 😭",
      "Tui কাছে থাকলে নেট লাগে না — heart connection strong 😹❤️",
      "Are you wifi? Because আমার মন তোকে ছাড়া connect হয় না 🙂"
    ];

    api.sendMessage(lines[Math.floor(Math.random() * lines.length)], event.threadID);
  }
};
