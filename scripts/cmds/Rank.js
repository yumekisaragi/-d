const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "rank",
  version: "4.0",
  author: "Mahiru Chan",
  countDown: 5,
  role: 0,
  shortDescription: "Show user rank with theme",
  longDescription: "Bangla + English theme based rank card",
  category: "user",
};

module.exports.run = async function ({ api, event, usersData, Currencies }) {
  try {
    const uid = event.senderID;

    // 🧩 USER INFO
    const name = await usersData.getName(uid);
    const userData = await usersData.get(uid);
    const money = (await Currencies.getData(uid)).money || 0;
    const exp = userData.exp || 0;
    const level = Math.floor(exp / 500);

    // 🖼 THEME BACKGROUND
    const theme =
      "https://i.imgur.com/8iHnR1M.jpeg"; // nice anime bg

    // 🖼 PROFILE PHOTO
    const avatar =
      `https://graph.facebook.com/${uid}/picture?width=512&height=512`;

    // 🗂 TEMP FILES
    const bgPath = path.join(__dirname, `${uid}_bg.jpg`);
    const avPath = path.join(__dirname, `${uid}_av.jpg`);

    const bgImg = await axios.get(theme, { responseType: "arraybuffer" });
    fs.writeFileSync(bgPath, Buffer.from(bgImg.data, "utf-8"));

    const avImg = await axios.get(avatar, { responseType: "arraybuffer" });
    fs.writeFileSync(avPath, Buffer.from(avImg.data, "utf-8"));

    // 📝 TEXT MESSAGE (Photo + Info)
    const msg = 
`🌸 𝗬𝗼𝘂𝗿 𝗥𝗮𝗻𝗸 𝗖𝗮𝗿𝗱 🌸

👤 Name: ${name}
💰 Money: ${money}
⭐ EXP: ${exp}
📈 Level: ${level}
🆔 UID: ${uid}

Theme added ✓  
Photo Attached ✓`;

    return api.sendMessage(
      {
        body: msg,
        attachment: [
          fs.createReadStream(bgPath),
          fs.createReadStream(avPath),
        ],
      },
      event.threadID,
      () => {
        fs.unlinkSync(bgPath);
        fs.unlinkSync(avPath);
      }
    );
  } catch (e) {
    return api.sendMessage(
      "⚠️ Rank CMD error হল ম্মহ্! আবার চেক কর।",
      event.threadID
    );
  }
};
