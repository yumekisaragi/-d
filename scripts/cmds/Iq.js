module.exports = {
  name: "iq",
  description: "IQ meter (just for fun)",
  author: "Mahiru Chan",

  execute(api, event) {
    const iq = Math.floor(Math.random() * 160);

    api.sendMessage(
      `🧠 IQ Test Complete!\nYour IQ: ${iq}\n\n(ভাই সিরিয়াস নিস না 😹 এটা just fun)`,
      event.threadID
    );
  }
};
