const Canvas = require("canvas");
const { uploadZippyshare } = global.utils;

const defaultFontName = "BeVietnamPro-SemiBold";
const defaultPathFontName = `${__dirname}/assets/font/BeVietnamPro-SemiBold.ttf`;
const { randomString } = global.utils;
const percentage = total => total / 100;

Canvas.registerFont(`${__dirname}/assets/font/BeVietnamPro-Bold.ttf`, {
	family: "BeVietnamPro-Bold"
});
Canvas.registerFont(defaultPathFontName, {
	family: defaultFontName
});

let deltaNext;
const expToLevel = (exp, deltaNextLevel = deltaNext) => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNextLevel)) / 2);
const levelToExp = (level, deltaNextLevel = deltaNext) => Math.floor(((Math.pow(level, 2) - level) * deltaNextLevel) / 2);
global.client.makeRankCard = makeRankCard;

module.exports = {
	config: {
		name: "rank",
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem level của bạn hoặc người được tag. Có thể tag nhiều người",
			en: "View your level or the level of the tagged person. You can tag many people"
		},
		category: "rank",
		guide: {
			vi: "   {pn} [để trống | @tags]",
			en: "   {pn} [empty | @tags]"
		},
		envConfig: {
			deltaNext: 5
		}
	},

	onStart: async function ({ message, event, usersData, threadsData, commandName, envCommands, api }) {
		deltaNext = envCommands[commandName].deltaNext;
		let targetUsers;
		const arrayMentions = Object.keys(event.mentions);

		if (arrayMentions.length == 0)
			targetUsers = [event.senderID];
		else
			targetUsers = arrayMentions;

		const rankCards = await Promise.all(targetUsers.map(async userID => {
			const rankCard = await makeRankCard(userID, usersData, threadsData, event.threadID, deltaNext, api);
			rankCard.path = `${randomString(10)}.png`;
			return rankCard;
		}));

		return message.reply({
			attachment: rankCards
		});
	},

	onChat: async function ({ usersData, event }) {
		let { exp } = await usersData.get(event.senderID);
		if (isNaN(exp) || typeof exp != "number")
			exp = 0;
		try {
			await usersData.set(event.senderID, {
				exp: exp + 1
			});
		}
		catch (e) { }
	}
};

const defaultDesignCard = {
	widthCard: 2000,
	heightCard: 500,
	main_color: "#474747",
	sub_color: "rgba(255, 255, 255, 0.5)",
	alpha_subcard: 0.9,
	exp_color: "#e1e1e1",
	expNextLevel_color: "#3f3f3f",
	text_color: "#000000"
};

async function makeRankCard(userID, usersData, threadsData, threadID, deltaNext, api = global.GoatBot.fcaApi) {
	const { exp } = await usersData.get(userID);
	const levelUser = expToLevel(exp, deltaNext);

	const expNextLevel = levelToExp(levelUser + 1, deltaNext) - levelToExp(levelUser, deltaNext);
	const currentExp = expNextLevel - (levelToExp(levelUser + 1, deltaNext) - exp);

	const allUser = await usersData.getAll();
	allUser.sort((a, b) => b.exp - a.exp);
	const rank = allUser.findIndex(user => user.userID == userID) + 1;

	const customRankCard = await threadsData.get(threadID, "data.customRankCard") || {};
	const dataLevel = {
		exp: currentExp,
		expNextLevel,
		name: allUser[rank - 1].name,
		rank: `#${rank}/${allUser.length}`,
		level: levelUser,
		avatar: await usersData.getAvatarUrl(userID)
	};

	const configRankCard = {
		...defaultDesignCard,
		...customRankCard
	};

	const checkImagKey = [
		"main_color",
		"sub_color",
		"line_color",
		"exp_color",
		"expNextLevel_color"
	];

	for (const key of checkImagKey) {
		if (!isNaN(configRankCard[key]))
			configRankCard[key] = await api.resolvePhotoUrl(configRankCard[key]);
	}

	const image = new RankCard({
		...configRankCard,
		...dataLevel
	});
	return await image.buildCard();
}


class RankCard {
	/**
	 * Create a new RankCard
	 * @param {Object} options - Options for the RankCard: 
	 * @param {String} options.main_color - The main color of the card
	 * @param {String} options.sub_color - The sub color of the card
	 * @param {Number} options.alpha_subcard - The alpha of the sub card
	 * @param {String} options.exp_color - The color of the exp bar
	 * @param {String} options.expNextLevel_color - The color of the expNextLevel bar
	 * @param {String} options.text_color - The color of the text
	 * @param {String} options.name_color - The color of the name
	 * @param {String} options.level_color - The color of the level
	 * @param {String} options.rank_color - The color of the rank
	 * @param {String} options.line_color - The color of the line
	 * @param {String} options.exp_text_color - The color of the exp text
	 * @param {Number} options.exp - The exp of the user
	 * @param {Number} options.expNextLevel - The expNextLevel of the user
	 * @param {String} options.name - The name of the user
	 * @param {Number} options.level - The level of the user
	 * @param {Number} options.rank - The rank of the user
	 * @param {String} options.avatar - The avatar of the user
	 * @param {Number} options.widthCard - The width of the card
	 * @param {Number} options.heightCard - The height of the card
	 * @param {String} options.fontName - The font name of the card
	 * @p
