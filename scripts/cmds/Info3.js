module.exports = {
  name: "info3",
  version: "1.0.0",
  author: "Mahiru Chan",
  cooldown: 5,
  description: "Shows full bot & server stats",
  commandCategory: "system",

  async onStart({ api, event }) {
    const os = require("os");

    // 📌 Ping
    const start = Date.now();
    await api.sendMessage("⏱️ Checking system...", event.threadID);
    const ping = Date.now() - start;

    // 📌 Uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // 📌 RAM
    const freeRAM = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const totalRAM = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

    // 📌 CPU
    const cpu = os.cpus()[0].model;
    const cores = os.cpus().length;
    const cpuUsage = (os.loadavg()[0]).toFixed(2);

    // 📌 No disk command (safe)
    const msg = `
╭━━━〔 🤖 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎 〕━━━╮
┃⏱️ Uptime : ${days}d ${hours}h ${minutes}m ${seconds}s
┃📶 Ping   : ${ping}ms
┃📦 Node   : ${process.version}
┃👑 Owner  : Mahiru Chan
╰━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 🖥 𝐒𝐄𝐑𝐕𝐄𝐑 𝐒𝐓𝐀𝐓𝐒 〕━━╮
┃🧠 RAM  : ${freeRAM}GB free / ${totalRAM}GB
┃⚙️ CPU  : ${cpu}
┃🔢 Cores: ${cores}
┃🔥 Load : ${cpuUsage}%
╰━━━━━━━━━━━━━━━━━━━━╯

╭━〔 ⚙️ 𝐒𝐘𝐒𝐓𝐄𝐌 〕━━━━━━━╮
┃🖥 OS   : ${os.type()} ${os.release()}
┃🔐 Safe : Media OK
╰━━━━━━━━━━━━━━━━━━━━╯`;

    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
