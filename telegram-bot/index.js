import { Telegraf, Markup, session } from "telegraf";
import randomColor from "randomcolor";
import { readdir } from "node:fs/promises";

import ImageContoller from "../controller/image.controller";
import template from "../telegram-bot__template-messages";

export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

const context__checkSessionData = async (ctx) => {
  if (!ctx.session) ctx.session = {};
  let username = ctx.message.from.username;
  if (!username) username = ctx.message.id;
  ctx.session.username = username;
  return;
};

const reply__context = async (ctx) => {
  await context__checkSessionData(ctx);

  if (!ctx.session.color || !ctx.session.text) {
    if (!ctx.session.text) ctx.session.text = await getRandom__text();
    if (!ctx.session.color) ctx.session.color = getRandom__color();
  }

  await ctx.replyWithMarkdownV2(`color: \`${ctx.session.color}\``);

  try {
    await ctx.replyWithMarkdownV2(`text: \`${ctx.session.text}\``);
  } catch (e) {}
};

const preview__render = async (ctx) => {
  try {
    await reply__context(ctx);
    return await ctx.replyWithPhoto({
      source: await ImageContoller.getPreview(ctx.session),
    });
  } catch (e) {
    return await ctx.reply(e.message);
  }
};

const getRandom__color = () => randomColor();

const getRandom__text = async () => {
  const getRandomFileIndex = (files) =>
    Math.floor(Math.random() * files.length);

  const dir = "./static/emojis";
  const files = await readdir(dir);

  const file__random = files[getRandomFileIndex(files)];
  // const file__random = files[files.length - 1];
  const file__path = `${dir}/${file__random}`;
  const file = Bun.file(file__path);
  return await file.text();
};

const bot__buttonText_randomColor = "RANDOM COLOR";
const bot__buttonText_randomEmoji = "RANDOM (´｡• ᵕ •｡`)";
const bot__buttonText_randomFull = "FULL RANDOM!";

bot.start(async (ctx) => {
  await context__checkSessionData(ctx);

  const message1 = await template("command__start-1");
  await ctx.reply(message1);
  await ctx.replyWithPhoto(
    {
      source: "./static/lepestochek__72dpi.png",
    },
    {
      caption: "Окей, эту графику мы будем красить.",
      ...Markup.keyboard([
        [bot__buttonText_randomEmoji, bot__buttonText_randomColor],
        [bot__buttonText_randomFull],
        [Markup.button.webApp("🎨 Выбрать цвет", process.env.WEB_APP_URL)],
        ["♨ Render!"],
      ]),
    }
  );
});

bot.hears(bot__buttonText_randomFull, async (ctx) => {
  await context__checkSessionData(ctx);

  ctx.session.text = await getRandom__text();
  ctx.session.text__set = true;
  ctx.session.color = getRandom__color();
  ctx.session.color__set = true;
  return await preview__render(ctx);
});

bot.hears(bot__buttonText_randomEmoji, async (ctx) => {
  await context__checkSessionData(ctx);
  ctx.session.text = await getRandom__text();
  ctx.session.text__set = true;

  if (!ctx.session.color__set) ctx.session.color = await getRandom__color();

  return await preview__render(ctx);
});

bot.hears(bot__buttonText_randomColor, async (ctx) => {
  await context__checkSessionData(ctx);
  ctx.session.color = getRandom__color();
  ctx.session.color__set = true;

  if (!ctx.session.text__set) ctx.session.text = await getRandom__text();

  return await preview__render(ctx);
});

bot.hears("♨ Render!", async (ctx) => {
  await reply__context(ctx);

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__print(ctx.session),
    filename: "flower__print_a3__bledd_5mm.png",
  });

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__wallpaper(ctx.session),
    filename: "flower__wallpaper_1400x3000__600.png",
  });

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__wallpaper(ctx.session, 256),
    filename: "flower__wallpaper_1400x3000__256.png",
  });

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__wallpaper(ctx.session, 64),
    filename: "flower__wallpaper_1400x3000__64.png",
  });

  ctx.session = {};

  const string0 = "Если есть желание поддержать автора - есть три опции:\n";
  const string1 =
    "1. Репост. Достаточно кинуть каринку и ссылку на бота, думаю, что тут, в описании и так все понятно.\n";
  const string2 =
    "2. Можешь напечатать через меня тот постер, что у тебя получится (файл print). Поставлю роспись и пронуменую на обороте - по канону. Матовая бумага + глянцевая печать SWAGG😎🎩\n";
  const string3 =
    "3. Перевод. Крипто-реквизиты прилагаю, реквизиты карты скажу в личном сообщении.\n\n";
  const string4 = `*TON: *\`UQABjSc6bP17rWBtTQ5HLpBwnmqQ3HC0KGL3ubHP2WZHEsFS\`\n`;
  const string5 = `*BTC: *\`1vcByaQcD1qj9wPV91ggc5pYUidcewVPo\`\n\n`;
  const string6 = "author: @iwwwanowww";

  await ctx.replyWithMarkdown(
    string0 + string1 + string2 + string3 + string4 + string5 + string6
  );
});

bot.on("message", async (ctx) => {
  await context__checkSessionData(ctx);
  const message__text = ctx.message?.text;
  const regex = /#\w\w\w\w\w\w/;

  if (ctx.webAppData || regex.test(message__text)) {
    if (ctx.webAppData?.data) ctx.session.color = ctx.webAppData.data.text();
    else ctx.session.color = message__text.match(regex)[0];
    ctx.session.color__set = true;
  } else {
    ctx.session.text = message__text;
    ctx.session.text__set = true;
  }
  return await preview__render(ctx);
});

bot.help(async (ctx) => {
  const message = await template("command__help");
  ctx.reply(message);
});
