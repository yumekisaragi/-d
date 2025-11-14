module.exports.config = {
    name: "toilet",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Watasi Sahib",
    description: "Toilet Image Generate 🚽",
    commandCategory: "Image",
    usages: "@mention",
    cooldowns: 5,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;

    const dir = __dirname + `/cache/`;
    const toiletPath = resolve(__dirname, "cache", "toilet.png");

    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(toiletPath))
        await downloadFile("https://i.imgur.com/BtSlsSS.jpg", toiletPath);
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const root = path.resolve(__dirname, "cache");

    let base = await jimp.read(root + "/toilet.png");
    let out = root + `/toilet_${one}_${two}.png`;

    let avt1 = root + `/avt_${one}.png`;
    let avt2 = root + `/avt_${two}.png`;

    // Avatar Download
    let get1 = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avt1, Buffer.from(get1, "utf-8"));

    let get2 = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avt2, Buffer.from(get2, "utf-8"));

    let circle1 = await jimp.read(await circle(avt1));
    let circle2 = await jimp.read(await circle(avt2));

    base.resize(292, 345)
        .composite(circle1.resize(75, 75), 100, 200)
        .composite(circle2.resize(75, 75), 180, 200);

    fs.writeFileSync(out, await base.getBufferAsync("image/png"));
    fs.unlinkSync(avt1);
    fs.unlinkSync(avt2);

    return out;
}

async function circle(img) {
    const jimp = require("jimp");
    let image = await jimp.read(img);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.handleEvent = function ({ event, api }) {
    const msg = event.body?.toLowerCase() || "";

    // Auto trigger without prefix
    if (msg.includes("toilet")) {
        if (Object.keys(event.mentions).length === 1) {
            module.exports.run({ event, api, args: [] });
        }
    }
};

module.exports.run = async function ({ event, api }) {
    const fs = global.nodemodule["fs-extra"];
    let mention = Object.keys(event.mentions);

    if (!mention[0])
        return api.sendMessage("Tag someone to flush 🚽🙂", event.threadID);

    let one = event.senderID;
    let two = mention[0];

    return makeImage({ one, two })
        .then(path =>
            api.sendMessage(
                { body: "🚽 Flush complete!", attachment: fs.createReadStream(path) },
                event.threadID,
                () => fs.unlinkSync(path)
            )
        );
};
