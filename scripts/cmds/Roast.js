module.exports = {
  name: "roast",
  description: "Savage roast Bangla + English mix 🔥",
  author: "Mahiru Chan",

  execute(api, event) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("Tag someone to roast 😹🔥", event.threadID);

    const roasts = [
      "Bro, tor face dekhle Google বলে 'No Data Found' 😹",
      "Tui এমন slow, snail o bole: ভাই তোকে দেখে shame লাগতেসে 😭",
      "Tor logic দেখলে physics ছুটি নিয়ে দেয় 🙂",
      "Tor জামা-জুতা দেখে মনে হয় discount e নিয়া এসেছস 😭🔥"
    ];

    api.sendMessage({
      body: roasts[Math.floor(Math.random() * roasts.length)],
      mentions: [{ id: mention }]
    }, event.threadID);
  }
};
