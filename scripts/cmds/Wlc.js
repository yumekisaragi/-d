const { config } = global.GoatBot;
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "whitelist",
    aliases: ["wl"],
    version: "1.2",
    author: "Watasi Sajib & Mahiru-chan (Optimized)",
    role: 2,
    countDown: 5,
    category: "owner",
    shortDescription: "Manage bot whitelist users",
    longDescription: {
      en: "Add, remove, list and toggle whitelist mode for bot usage.",
    },
    guide: {
      en:
        "{pn} add <uid | @tag | reply>\n" +
        "{pn} remove <uid | @tag | reply>\n" +
        "{pn} list\n" +
        "{pn} on\n" +
        "{pn} off",
    },
  },

  langs: {
    en: {
      added: "✅ Added to whitelist:\n%1",
      already: "⚠ Already whitelisted:\n%1",
      remove: "✅ Removed from whitelist:\n%1",
      notFound: "⚠ Not found in whitelist:\n%1",
      list: "👑 Whitelisted Users:\n%1",
      enable: "✅ Whitelist Mode ENABLED\nOnly whitelisted users can use bot.",
      disable: "🟦 Whitelist Mode DISABLED\nEveryone can use bot.",
      noIDAdd: "⚠ Provide uid, tag or reply to add.",
      noIDRemove: "⚠ Provide uid, tag or reply to remove.",
      noPermission: "❌ You are not allowed to use this command!",
    },
  },

  onStart: async function ({ message, args, event, usersData, getLang }) {
    // Only bot owner(s)
    const permission = ["100051997177668"]; // << tori UID
    if (!permission.includes(event.senderID))
      return message.reply(getLang("noPermission"));

    const wlConfig = config.whiteListMode;

    // helper: save config
    const saveConfig = () =>
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

    // helper: extract UIDs
    const extractUIDs = () => {
      let uids = [];

      if (Object.keys(event.mentions).length > 0) {
        uids = Object.keys(event.mentions);
      } else if (event.messageReply) {
        uids.push(event.messageReply.senderID);
      } else {
        uids = args.slice(1).filter((id) => /^\d+$/.test(id));
      }

      return uids;
    };

    switch (args[0]?.toLowerCase()) {
      // ADD
      case "add": {
        const uids = extractUIDs();
        if (!uids.length) return message.reply(getLang("noIDAdd"));

        const added = [];
        const already = [];

        for (const uid of uids) {
          if (wlConfig.whiteListIds.includes(uid)) already.push(uid);
          else {
            wlConfig.whiteListIds.push(uid);
            added.push(uid);
          }
        }

        saveConfig();

        const names = await Promise.all(
          uids.map((uid) =>
            usersData.getName(uid).then((name) => `${name} (${uid})`)
          )
        );

        return message.reply(
          (added.length
            ? getLang(
                "added",
                added.map((uid) => names[uids.indexOf(uid)]).join("\n")
              )
            : "") +
            (already.length
              ? "\n" +
                getLang(
                  "already",
                  already.map((uid) => names[uids.indexOf(uid)]).join("\n")
                )
              : "")
        );
      }

      // REMOVE
      case "remove": {
        const uids = extractUIDs();
        if (!uids.length) return message.reply(getLang("noIDRemove"));

        const removed = [];
        const notFound = [];

        for (const uid of uids) {
          if (wlConfig.whiteListIds.includes(uid)) {
            wlConfig.whiteListIds.splice(
              wlConfig.whiteListIds.indexOf(uid),
              1
            );
            removed.push(uid);
          } else notFound.push(uid);
        }

        saveConfig();

        const names = await Promise.all(
          uids.map((uid) =>
            usersData.getName(uid).then((name) => `${name} (${uid})`)
          )
        );

        return message.reply(
          (removed.length
            ? getLang(
                "remove",
                removed.map((uid) => names[uids.indexOf(uid)]).join("\n")
              )
            : "") +
            (notFound.length
              ? "\n" +
                getLang(
                  "notFound",
                  notFound.map((uid) => names[uids.indexOf(uid)]).join("\n")
                )
              : "")
        );
      }

      // LIST
      case "list": {
        if (!wlConfig.whiteListIds.length)
          return message.reply(getLang("list", "No whitelist users."));

        const names = await Promise.all(
          wlConfig.whiteListIds.map((uid) =>
            usersData.getName(uid).then((name) => `${name} (${uid})`)
          )
        );

        return message.reply(getLang("list", names.join("\n")));
      }

      // ENABLE
      case "on": {
        wlConfig.enable = true;
        saveConfig();
        return message.reply(getLang("enable"));
      }

      // DISABLE
      case "off": {
        wlConfig.enable = false;
        saveConfig();
        return message.reply(getLang("disable"));
      }

      default:
        return message.SyntaxError();
    }
  },
};
