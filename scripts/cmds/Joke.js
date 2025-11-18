module.exports = {
  name: "joke",
  description: "Funny Bangla-English jokes 😂",
  author: "Mahiru Chan",

  execute(api, event) {
    const jokes = [
      "Teacher: Why are you late?\nStudent: Sir, time e ashte gelo time sesh hoye gelo 🙂",
      "Boy: Baby do you love me?\nGirl: Tui ke re pagol, FB er react er poriman dekh 😭",
      "Doctor: আপনি tension নেন না.\nPatient: কিন্তু tension তো আপনিই দিলেন ডাক্তার 😭💔",
      "Mum: Mobile নামা!\nMe: Amar life er server down hoye jabe 😹"
    ];

    api.sendMessage(jokes[Math.floor(Math.random() * jokes.length)], event.threadID);
  }
};
