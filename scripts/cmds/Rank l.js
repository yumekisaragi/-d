// commands/rank.js
const Canvas = require("canvas");
const jimp = require("jimp");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "rank",
    version: "2.0",
    author: "Watasi Sajib & Mahiru Chan",
    role: 0,
    countDown: 5,
    shortDescription: "Show rank card (Dark Anime theme)",
    longDescription: "Generate an anime-styled dark rank card. Tag multiple users to get many cards.",
    category: "rank",
    guide: "{pn} [empty | @tags]"
  },

  // prepare cache and assets
  onLoad: async function () {
    const dir = path.join(__dirname, "cache");
    fs.ensureDirSync(dir);
    // optional: you can add font files to assets/font and register below
    try {
      const fontPath = path.join(__dirname, "assets", "font", "BeVietnamPro-SemiBold.ttf");
      if (fs.existsSync(fontPath)) {
        Canvas.registerFont(fontPath, { family: "BeVietnamPro" });
      }
    } catch (e) { /* ignore if no custom font */ }
  },

  // called when user runs command manually
  onStart: async function ({ message, event, usersData, threadsData, commandName, envCommands }) {
    // deltaNext for level formula (fallback 5)
    const deltaNext = (envCommands[commandName] && envCommands[commandName].deltaNext) || 5;

    // collect targets (tags) or default to sender
    const mentions = Object.keys(event.mentions || {});
    const targets = mentions.length ? mentions : [event.senderID];

    // build cards for each target
    const cards = await Promise.all(targets.map(async uid => {
      const buffer = await buildRankCard(uid, usersData, threadsData, event.threadID, deltaNext);
      return { filename: `rank_${uid}.png`, value: buffer };
    }));

    // send attachments (if multiple, attach array)
    return message.reply({ attachment: cards });
  },

  // auto exp increment on chat
  onChat: async function ({ usersData, event }) {
    try {
      const user = await usersData.get(event.senderID);
      let exp = Number(user.exp) || 0;
      exp += 1; // increase 1 exp per message
      await usersData.set(event.senderID, { exp });
    } catch (e) { /* silent */ }
  }
};

// ----------------- helper functions -----------------

function expToLevel(exp, deltaNext = 5) {
  // inverse triangular formula used in many rank systems
  return Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);
}
function levelToExp(level, deltaNext = 5) {
  return Math.floor(((Math.pow(level, 2) - level) * deltaNext) / 2);
}

// main builder: returns Buffer of PNG
async function buildRankCard(userID, usersData, threadsData, threadID, deltaNext) {
  // get data
  const userRecord = await usersData.get(userID);
  const exp = Number(userRecord.exp) || 0;
  const name = (userRecord.name || "Unknown").length > 25 ? (userRecord.name.slice(0, 22) + "...") : (userRecord.name || "Unknown");

  const level = expToLevel(exp, deltaNext);
  const nextLevelExpTotal = levelToExp(level + 1, deltaNext);
  const currentLevelExpTotal = levelToExp(level, deltaNext);
  const expForThisLevel = nextLevelExpTotal - currentLevelExpTotal;
  const expProgress = exp - currentLevelExpTotal;
  const percent = Math.max(0, Math.min(1, expProgress / (expForThisLevel || 1)));

  // rank position among all users (if usersData supports getAll)
  let rankText = "#?";
  try {
    const allUsers = await usersData.getAll();
    allUsers.sort((a, b) => (Number(b.exp) || 0) - (Number(a.exp) || 0));
    const pos = allUsers.findIndex(u => String(u.userID) === String(userID));
    if (pos !== -1) rankText = `#${pos + 1}/${allUsers.length}`;
  } catch (e) {
    rankText = "N/A";
  }

  // avatar fetch (use FB graph)
  const avatarUrl = await usersData.getAvatarUrl(userID).catch(() => null);
  const avatarBuffer = await fetchAvatarBuffer(userID, avatarUrl);

  // Canvas dimensions
  const width = 1600;
  const height = 520;
  const canvas = Canvas.createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background: dark anime gradient (purple -> pink)
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#0f0c29"); // deep midnight
  grad.addColorStop(0.45, "#3b0764"); // indigo
  grad.addColorStop(0.8, "#8a2387"); // purple-pink
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // subtle stars/noise (anime feel)
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height * 0.6;
    const r = Math.random() * 1.6;
    ctx.beginPath();
    ctx.globalAlpha = 0.06 + Math.random() * 0.08;
    ctx.fillStyle = "#ffffff";
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // left panel subcard (semi-transparent glass)
  const pad = 40;
  const subX = pad;
  const subY = 40;
  const subW = width - pad * 2;
  const subH = height - pad * 2;
  roundRect(ctx, subX, subY, subW, subH, 20, true, false, "rgba(255,255,255,0.04)");

  // inner dark card
  roundRect(ctx, subX + 12, subY + 12, subW - 24, subH - 24, 16, true, false, "rgba(0,0,0,0.35)");

  // neon ring for avatar
  const avatarSize = 220;
  const avatarX = subX + 48;
  const avatarY = subY + (subH / 2) - (avatarSize / 2);

  // draw soft glow circle behind avatar
  const glowGrad = ctx.createRadialGradient(avatarX + avatarSize / 2, avatarY + avatarSize / 2, 10, avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize);
  glowGrad.addColorStop(0, "rgba(255, 200, 230, 0.25)");
  glowGrad.addColorStop(0.4, "rgba(150, 100, 255, 0.12)");
  glowGrad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // avatar clipped circle
  if (avatarBuffer) {
    const avatarImg = await Canvas.loadImage(avatarBuffer);
    // draw circular avatar with slight border
    drawCircularImage(ctx, avatarImg, avatarX, avatarY, avatarSize, "#ffffff", 8);
  } else {
    // fallback - blank circle
    roundRect(ctx, avatarX, avatarY, avatarSize, avatarSize, avatarSize/2, true, false, "#222");
  }

  // anime sticker (simple stylized eye sparkle) top-left of avatar
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.ellipse(avatarX + avatarSize - 30, avatarY + 20, 28, 12, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Name and text
  const nameX = avatarX + avatarSize + 40;
  const nameY = avatarY + 60;
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold 46px ${Canvas.FontFamily || "sans-serif"}`;
  // if custom font registered, use it
  ctx.font = `700 ${36 + (this && this.textSize ? this.textSize : 12)}px ${"BeVietnamPro"}`;
  ctx.fillText(name, nameX, nameY);

  // rank and level badges
  ctx.font = "600 28px BeVietnamPro";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(`Level: ${level}`, nameX, nameY + 48);
  ctx.fillText(`${rankText}`, nameX + 230, nameY + 48);

  // small subtitle (anime vibe)
  ctx.font = "400 18px BeVietnamPro";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText(`EXP: ${expProgress}/${expForThisLevel}  •  Next: ${expForThisLevel}`, nameX, nameY + 80);

  // Draw progress bar background
  const barW = subW - (nameX - subX) - 60;
  const barH = 36;
  const barX = nameX;
  const barY = avatarY + avatarSize - 40;

  // progress background (glass)
  roundRect(ctx, barX, barY, barW, barH, 18, true, false, "rgba(255,255,255,0.08)");

  // gradient progress (pink -> purple)
  const progGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
  progGrad.addColorStop(0, "#ff94d1");
  progGrad.addColorStop(0.6, "#a14bff");
  progGrad.addColorStop(1, "#3b0f9e");

  // fill progress
  ctx.globalCompositeOperation = "source-over";
  roundRect(ctx, barX, barY, Math.max(6, Math.floor(barW * percent)), barH, 18, true, false, progGrad);

  // outline progress glow
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  roundRect(ctx, barX, barY, barW, barH, 18, false, true, null);

  // draw small anime emblem on right
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.arc(subX + subW - 80, subY + 80, 36, 0, Math.PI * 2);
  ctx.fill();

  // bottom-left: small stats (three blocks)
  const statX = subX + 48;
  const statY = subY + subH - 120;
  const blockW = 320, blockH = 80;

  // block 1: Rank
  roundRect(ctx, statX, statY, blockW, blockH, 12, true, false, "rgba(255,255,255,0.03)");
  ctx.fillStyle = "#fff";
  ctx.font = "600 28px BeVietnamPro";
  ctx.fillText(rankText, statX + 20, statY + 48);
  ctx.font = "400 16px BeVietnamPro";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("RANK", statX + 20, statY + 22);

  // block 2: Level
  const statX2 = statX + blockW + 20;
  roundRect(ctx, statX2, statY, blockW, blockH, 12, true, false, "rgba(255,255,255,0.03)");
  ctx.fillStyle = "#fff";
  ctx.font = "600 28px BeVietnamPro";
  ctx.fillText(String(level), statX2 + 20, statY + 48);
  ctx.font = "400 16px BeVietnamPro";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("LEVEL", statX2 + 20, statY + 22);

  // block 3: Position (exp %)
  const statX3 = statX2 + blockW + 20;
  roundRect(ctx, statX3, statY, blockW, blockH, 12, true, false, "rgba(255,255,255,0.03)");
  ctx.fillStyle = "#fff";
  ctx.font = "600 28px BeVietnamPro";
  ctx.fillText(Math.floor(percent * 100) + "%", statX3 + 20, statY + 48);
  ctx.font = "400 16px BeVietnamPro";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillText("PROGRESS", statX3 + 20, statY + 22);

  // small footer text
  ctx.font = "300 14px BeVietnamPro";
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.fillText("𝑴𝒂𝒉𝒊𝒓𝒖 𝑪𝒉𝒂𝒏 Bot • Anime Rank Card", subX + 24, subY + subH - 12);

  // final buffer
  const buffer = canvas.toBuffer("image/png");
  return buffer;
}

// fetch avatar buffer using graph api fallback
async function fetchAvatarBuffer(uid, avatarUrl) {
  try {
    // try provided avatarUrl first
    if (avatarUrl) {
      const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
      return res.data;
    }
  } catch (e) { /* ignore */ }

  try {
    const res2 = await axios.get(`https://graph.facebook.com/${uid}/picture?width=512&height=512`, { responseType: "arraybuffer" });
    return res2.data;
  } catch (e) {
    return null;
  }
}

// draw rounded rectangle helper
function roundRect(ctx, x, y, w, h, r, fill = true, stroke = false, fillStyle = "#000") {
  if (typeof r === "undefined") r = 5;
  if (typeof r === "number") r = { tl: r, tr: r, br: r, bl: r };
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
  if (fill) {
    if (fillStyle && typeof fillStyle === "object" && fillStyle.type === "gradient") {
      // not used here
    } else {
      ctx.fillStyle = fillStyle || "#000";
      ctx.fill();
    }
  }
  if (stroke) {
    ctx.strokeStyle = stroke === true ? "#000" : stroke;
    ctx.stroke();
  }
}

// draw circular image with border
function drawCircularImage(ctx, img, x, y, size, borderColor = "#fff", borderWidth = 6) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  const radius = size / 2;

  // draw border glow
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius + borderWidth / 2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(161,75,255,0.12)";
  ctx.fill();
  ctx.restore();

  // clip circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // draw image fitted
  ctx.drawImage(img, x, y, size, size);
  ctx.restore();

  // stroke border
  ctx.beginPath();
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColor;
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();
      }
