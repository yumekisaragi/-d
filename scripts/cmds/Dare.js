module.exports = {
  name: "dare",
  description: "Dare challenge 😹🔥",
  author: "Mahiru Chan",

  execute(api, event) {
    const dares = [
      "নিজের dp পাঠাও group e now 😭🔥",
      "যে active আছে তাকে বলো: 'Tui amar valobasha 🙂'",
      "নিজের শেষ crush এর নাম লিখে send দে 😹💀",
      "Voice message দে: 'Ami pagol' 🤣"
    ];

    api.sendMessage(dares[Math.floor(Math.random() * dares.length)], event.threadID);
  }
};
