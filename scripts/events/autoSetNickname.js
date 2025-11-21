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
      api.changeNickname("HoneyBee 🍯🐝", threadID, botID);
    }

    // Send welcome message for others
    for (const participant of dataAddedParticipants) {
      if (participant.userFbId !== botID) {
        api.sendMessage(
          `🌸 Welcome @${participant.fullName}!\n
          আসসালামু আলাইকুম/হ্যালো সবাই 🌼
আশা করি সবাই ভালো আছো।
এই গ্রুপে সক্রিয় থাকো, সুন্দরভাবে কথা বলো, এবং একে অপরকে সম্মান করো।
অপ্রয়োজনীয় ঝামেলা, খারাপ ভাষা বা ড্রামা এড়িয়ে চলি।
সবাই মিলে গ্রুপটাকে একটু সুন্দর, শান্ত আর ফ্রেন্ডলি করে তুলি। 💚✨
ধন্যবাদ সবাইকে। 😊`,
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
