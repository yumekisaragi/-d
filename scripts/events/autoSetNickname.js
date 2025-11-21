module.exports = {
  config: {
    name: "welcome2",
    version: "2.1",
    author: "nafijninja",
    category: "events"
  },

  onStart: async ({ event, api }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID } = event;
    const dataAddedParticipants = event.logMessageData.addedParticipants;
    const botID = api.getCurrentUserID();

    // If the bot was added, set nickname
    if (dataAddedParticipants.some(item => item.userFbId == botID)) {
      api.changeNickname("😾 angry sizukua🥺🌷", threadID, botID);
    }

    // Send welcome message for others
    for (const participant of dataAddedParticipants) {
      if (participant.userFbId !== botID) {
        api.sendMessage(
          `🌸 Welcome @${participant.fullName}!\n
          nআসসালামু আলাইকুম & Welcome ✨🌸আমাদের গ্রুপে তোমাকে আন্তরিক স্বাগতম ও শুভেচ্ছা!  
তোমার উপস্থিতি আমাদের জন্য নতুন ভাবনা, নতুন আশা ও ইতিবাচক অনুভূতি নিয়ে এসেছে।  
We’re truly glad to have you here — your presence means fresh ideas, positive energy and new perspectives.
এখানে আমরা সম্মান, শেখা, জ্ঞান শেয়ার করা, এবং সুন্দর vibe বজায় রাখার চেষ্টা করি।  
Here, we value respect, learning, collaboration & good vibes only.  
আমরা আশা করি তোমার চিন্তা, প্রতিভা, সৃজনশীলতা এবং সক্রিয় অংশগ্রহণ  
আমাদের কমিউনিটিকে আরও সমৃদ্ধ করবে ইনশাআল্লাহ 🕊️
✨ Welcome to the family ✨  
Stay positive, stay connected, stay blessed 💝`,
          threadID,
          (err, info) => {
            api.sendMessage(
              { mentions: [{ id: participant.userFbId, tag: participant.fullName }] },
              threadID,
              null,
              info.messageID
            );
          }
        );
      }
    }

  }
};
