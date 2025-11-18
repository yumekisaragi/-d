module.exports = {
  name: "gayrate",
  description: "Gay percentage meter 🌈",
  author: "Mahiru Chan",

  execute(api, event) {
    const rate = Math.floor(Math.random() * 101);
    api.sendMessage(`🌈 Gay Rate Result: ${rate}% 😹\nThis is just for fun bro 🙂`, event.threadID);
  }
};
