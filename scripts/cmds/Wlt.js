const { config } = global.GoatBot;
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "whitelist",
    aliases: ["wl"],
    version: "1.1",
    author: "Watashi Sajib",
    countDown: 5,
    role: 2,
    longDescription: {
      en: "Add, remove, edit whiteListIds"
    },
    category: "owner",
    guide: {
      en: '   {pn} add <uid | @tag>: Add user to whitelist\n' +
          '   {pn} remove <uid | @tag>: Remove user from whitelist\n' +
          '   {pn} list: Show all whitelisted users\n' +
          '   {pn} on: Enable whitelist mode (only whitelist users can use bot)\n' +
          '   {pn} off: Disable whitelist mode'
    }
  },

  langs: {
    en: {
      added: "✅ Added to whitelist:\n%1",
      alreadyAdmin: "⚠ Already whitelisted:\n%1",
      missingIdAdd: "⚠ Please provide a user ID or tag to add to whitelist",
      removed: "✅ Removed from whitelist:\n%1",
      notAdmin: "⚠ Not in whitelist:\n%1",
      missingIdRemove: "⚠ Please provide a user ID or tag to remove from whitelist",
      listAdmin: "👑 Whitelist Users:\n%1",
      enable: "✅ Whitelist mode ENABLED (only whitelist users can use bot)",
      disable: "✅ Whitelist mode DISABLED (anyone can use bot)",
      noPermission: "❌ You do not have permission to use this command!"
    }
  },

  onStart: async function ({ message, args, usersData, event, getLang }) {
    const permission = ["100051997177668"];
    if (!permission.includes(event.senderID)) 
      return message.reply(getLang("noPermission"));

    switch (args[0]?.toLowerCase()) {
      case "add": {
        if (!args[1]) return message.reply(getLang("missingIdAdd"));

        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.slice(1).filter(arg => !isNaN(arg));

        const added = [];
        const already = [];
        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) already.push(uid);
          else {
            config.whiteListMode.whiteListIds.push(uid);
            added.push(uid);
          }
        }

        const names = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => `${name} (${uid})`)));

        fs.writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (added.length ? getLang("added", added.map(uid => names[uids.indexOf(uid)]).join("\n")) : "") +
          (already.length ? "\n" + getLang("alreadyAdmin", already.map(uid => names[uids.indexOf(uid)]).join("\n")) : "")
        );
      }

      case "remove": {
        if (!args[1]) return message.reply(getLang("missingIdRemove"));

        let uids = [];
        if (Object.keys(event.mentions).length > 0) uids = Object.keys(event.mentions);
        else if (event.messageReply) uids.push(event.messageReply.senderID);
        else uids = args.slice(1).filter(arg => !isNaN(arg));

        const removed = [];
        const notInList = [];

        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) {
            config.whiteListMode.whiteListIds.splice(config.whiteListMode.whiteListIds.indexOf(uid), 1);
            removed.push(uid);
          } else notInList.push(uid);
        }

        const names = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => `${name} (${uid})`)));

        fs.writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

        return message.reply(
          (removed.length ? getLang("removed", removed.map(uid => names[uids.indexOf(uid)]).join("\n")) : "") +
          (notInList.length ? "\n" + getLang("notAdmin", notInList.map(uid => names[uids.indexOf(uid)]).join("\n")) : "")
        );
      }

      case "list": {
        const names = await Promise.all(config.whiteListMode.whiteListIds.map(uid => usersData.getName(uid).then(name => `${name} (${uid})`)));
        return message.reply(getLang("listAdmin", names.join("\n")));
      }

      case "on": {
        config.whiteListMode.enable = true;
        fs.writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang("enable"));
      }

      case "off": {
        config.whiteListMode.enable = false;
        fs.writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
        return message.reply(getLang("disable"));
      }

      default:
        return message.SyntaxError();
    }
  }
};
