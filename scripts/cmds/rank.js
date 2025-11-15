// rank.js (Lightweight, no canvas/jimp/axios/fs-extra required)
module.exports = {
  config: {
    name: "rank",
    version: "1.0",
    author: "Watasi Sajib & Mahiru Chan",
    role: 0,
    countDown: 3,
    category: "rank",
    shortDescription: "Show rank/level (text only, no image)",
    longDescription: "Lightweight rank command for bots without canvas/jimp/etc.",
    guide: "{pn} [empty | @tags]",
    envConfig: {
      deltaNext: 5
    }
  },

  // called when user runs command
  onStart: async function ({ message, event, usersData, threadsData, commandName, envCommands }) {
    const deltaNext = (envCommands[commandName] && envCommands[commandName].deltaNext) || 5;
    const mentions = Object.keys(event.mentions || {});
    const targets = mentions.length ? mentions : [event.senderID];

    try {
      for (const uid of targets) {
        const text = await buildTextRank(uid, usersData, threadsData, event.threadID, deltaNext);
        await message.reply(text);
      }
    } catch (err) {
      console.error(err);
      return message.reply("Error generating rank info 😭");
    }
  },

  // auto xp increment on chat
  onChat: async function ({ usersData, event }) {
    try {
      const me = await usersData.get(event.senderID);
      let exp = Number(me.exp) || 0;
      exp += 1; // increase 1 exp per message
      await usersData.set(event.senderID, { exp });
    } catch (e) { /* silent */ }
  }
};

// ---------- helper math ----------
function expToLevel(exp, deltaNext = 5) {
  return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}
function levelToExp(level, deltaNext = 5) {
  return Math.floor(((Math.pow(level, 2) - level) * deltaNext) / 2);
}

// ---------- build text card ----------
async function buildTextRank(userID, usersData, threadsData, threadID, deltaNext) {
  // get user data
  const record = await usersData.get(userID) || {};
  const nameRaw = record.name || `User ${userID}`;
  const name = (nameRaw.length > 24) ? (nameRaw.slice(0, 21) + "...") : nameRaw;
  const exp = Number(record.exp) || 0;

  const level = expToLevel(exp, deltaNext);
  const nextTotal = levelToExp(level + 1, deltaNext);
  const curTotal = levelToExp(level, deltaNext);
  const expForLevel = Math.max(1, nextTotal - curTotal);
  const expProgress = Math.max(0, exp - curTotal);
  const percent = Math.floor((expProgress / expForLevel) * 100);

  // rank among users (if available)
  let rankText = "N/A";
  try {
    const all = await usersData.getAll();
    if (Array.isArray(all) && all.length) {
      all.sort((a, b) => (Number(b.exp)||0) - (Number(a.exp)||0));
      const idx = all.findIndex(u => String(u.userID) === String(userID));
      if (idx !== -1) rankText = `#${idx + 1}/${all.length}`;
    }
  } catch (e) {
    rankText = "N/A";
  }

  // thread custom rank card title (optional)
  const custom = await threadsData.get(threadID, "data.customRankCard").catch(() => null);
  const title = (custom && custom.title) ? custom.title : "🌸 Anime Rank Card • Sakura";

  // simple progress bar (text)
  const bar = makeProgressBar(percent, 20, "▮", "▯");

  // avatar url (if usersData exposes one)
  let avatarLine = "";
  try {
    if (typeof usersData.getAvatarUrl === "function") {
      const url = await usersData.getAvatarUrl(userID);
      if (url) avatarLine = `Avatar: ${url}\n`;
    }
  } catch (e) { /* ignore */ }

  // final message (English+Bangla mix friendly)
  const lines = [];
  lines.push("╭───────────── " + title + " ─────────────╮");
  lines.push(`│ 👤 Name : ${name}`);
  lines.push(`│ 🆔 ID   : ${userID}`);
  lines.push(`│ 🏷 Rank : ${rankText}`);
  lines.push(`│ ⭐ Level: ${level}`);
  lines.push(`│ ✨ EXP  : ${expProgress}/${expForLevel}  (${percent}%)`);
  lines.push(`│ 📊 Bar  : ${bar}`);
  if (avatarLine) lines.push(`│ ${avatarLine.trim()}`);
  lines.push("╰──────────────────────────────────────╯");
  lines.push("");
  lines.push("Tip: teach the bot using:");
  lines.push("  teach: pookie = amar special user 💖");
  lines.push("");
  lines.push("• Bot: Mahiru Chan •");

  return lines.join("\n");
}

// helper to make ascii progress bar
function makeProgressBar(percent, length = 20, filledChar = "█", emptyChar = "░") {
  const filledCount = Math.round((percent / 100) * length);
  const emptyCount = Math.max(0, length - filledCount);
  return filledChar.repeat(filledCount) + emptyChar.repeat(emptyCount) + ` ${percent}%`;
    }
