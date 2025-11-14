const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: "pair",
    version: "1.7",
    author: "MahMUD",
    category: "love",
    guide: "{prefix}pair"
  },

  onStart: async function ({ event, threadsData, message, usersData, api }) {
    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return api.sendMessage("You are not authorized to change the author name.\n", event.threadID, event.messageID);
    }

    try {
      const uidI = event.senderID;
      const name1 = await usersData.getName(uidI);
      const avatarUrl1 = (typeof usersData.getAvatarUrl === "function") ? await usersData.getAvatarUrl(uidI) : null;
      const threadData = await threadsData.get(event.threadID);
      if (!threadData || !Array.isArray(threadData.members)) return api.sendMessage("âŒ Could not fetch thread members.", event.threadID, event.messageID);

      const senderInfo = threadData.members.find(mem => (mem.userID == uidI || mem.id == uidI));
      const gender1 = senderInfo?.gender;
      if (!gender1 || (gender1 !== "MALE" && gender1 !== "FEMALE")) return api.sendMessage("âŒ Couldn't determine your gender. Please update your profile.", event.threadID, event.messageID);

      const oppositeGender = gender1 === "MALE" ? "FEMALE" : "MALE";
      const candidates = threadData.members.filter(member => {
        const memGender = member.gender;
        const memId = member.userID ?? member.id;
        const inGroup = ("inGroup" in member) ? !!member.inGroup : true;
        return memGender === oppositeGender && inGroup && memId != uidI;
      });

      if (candidates.length === 0) return api.sendMessage(`âŒ No ${oppositeGender.toLowerCase()} members found in this group.`, event.threadID, event.messageID);

      const matched = candidates[Math.floor(Math.random() * candidates.length)];
      const matchedId = matched.userID ?? matched.id;
      const name2 = await usersData.getName(matchedId);
      const avatarUrl2 = (typeof usersData.getAvatarUrl === "function") ? await usersData.getAvatarUrl(matchedId) : null;

      const lovePercent = Math.floor(Math.random() * 36) + 65;
      const compatibility = Math.floor(Math.random() * 36) + 65;

      function toBoldUnicode(name) {
        const boldAlphabet = {
          "a": "ðš","b": "ð›","c": "ðœ","d": "ð","e": "ðž","f": "ðŸ","g": "ð ","h": "ð¡","i": "ð¢","j": "ð£",
          "k": "ð¤","l": "ð¥","m": "ð¦","n": "ð§","o": "ð¨","p": "ð©","q": "ðª","r": "ð«","s": "ð¬","t": "ð­",
          "u": "ð®","v": "ð¯","w": "ð°","x": "ð±","y": "ð²","z": "ð³","A": "ð€","B": "ð","C": "ð‚","D": "ðƒ",
          "E": "ð„","F": "ð…","G": "ð†","H": "ð‡","I": "ðˆ","J": "ð‰","K": "ðŠ","L": "ð‹","M": "ðŒ","N": "ð",
          "O": "ðŽ","P": "ð","Q": "ð","R": "ð‘","S": "ð’","T": "ð“","U": "ð”","V": "ð•","W": "ð–","X": "ð—",
          "Y": "ð˜","Z": "ð™","0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
          " ":" ","'":"'"," ,":",",".":".","-":"-","!":"!","?":"?"
        };
        return String(name || "").split('').map(char => boldAlphabet[char] || char).join('');
      }

      const styledName1 = toBoldUnicode(name1 || "Unknown");
      const styledName2 = toBoldUnicode(name2 || "Unknown");

      const styledMessage = `
ðŸ’–âœ¨ ð—¡ð—²ð˜„ ð—£ð—®ð—¶ð—¿ ð—”ð—¹ð—²ð—¿ð˜! âœ¨ðŸ’–

ðŸŽ‰ ð„ð¯ðžð«ð²ð¨ð§ðž, ð¥ðžð­'ð¬ ðœð¨ð§ð ð«ðšð­ð®ð¥ðšð­ðž ð¨ð®ð« ð¥ð¨ð¯ðžð¥ð² ð§ðžð° ðœð¨ð®ð©ð¥ðž

â€¢ ${styledName1}  
â€¢ ${styledName2}

â¤  ð‹ð¨ð¯ðž ððžð«ðœðžð§ð­ðšð ðž: ${lovePercent}%  
ðŸŒŸ ð‚ð¨ð¦ð©ðšð­ð¢ð›ð¢ð¥ð¢ð­ð²: ${compatibility}%

ðŸ’ ðŒðšð² ð²ð¨ð®ð« ð¥ð¨ð¯ðž ð›ð¥ð¨ð¨ð¦ ðŸð¨ð«ðžð¯ðžð«`;

      const attachments = [];
      try {
        if (avatarUrl1) {
          const s1 = await getStreamFromURL(avatarUrl1).catch(() => null);
          if (s1) attachments.push(s1);
        }
        if (avatarUrl2) {
          const s2 = await getStreamFromURL(avatarUrl2).catch(() => null);
          if (s2) attachments.push(s2);
        }
      } catch {}

      if (attachments.length > 0)
        return api.sendMessage({ body: styledMessage, attachment: attachments }, event.threadID, event.messageID);
      else
        return api.sendMessage(styledMessage, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("âŒ An unexpected error occurred.", event.threadID, event.messageID);
    }
  }
};
