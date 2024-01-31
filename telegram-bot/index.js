import { Telegraf, Markup, session } from "telegraf";
import { message } from "telegraf/filters";
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

const preview__render = async (ctx) => {
  try {
    return await ctx.replyWithPhoto({
      source: await ImageContoller.getPreview(ctx.session),
    });
  } catch (e) {
    return await ctx.reply(e.message);
  }
};

bot.start(async (ctx) => {
  if (!ctx.session) ctx.session = {};

  const message1 = await template("command__start-1");
  await ctx.reply(message1);
  await ctx.replyWithPhoto(
    {
      source: "./static/lepestochek__72dpi.png",
    },
    {
      caption: "Окей, эту графику мы будем красить.",
      ...Markup.keyboard([
        ["EMOJI (´｡• ᵕ •｡`)", "COLOR"],
        [Markup.button.webApp("♦ Изменить цвет", process.env.WEB_APP_URL)],
        ["♨ Render!"],
      ]),
    }
  );
});

bot.hears("EMOJI (´｡• ᵕ •｡`)", async (ctx) => {
  await context__checkSessionData(ctx);

  const getRandomFileIndex = (files) =>
    Math.floor(Math.random() * files.length);

  const dir = "./static/emojis";
  const files = await readdir(dir);

  const file__random = files[getRandomFileIndex(files)];
  const file__path = `${dir}/${file__random}`;
  const file = Bun.file(file__path);
  const file__text = await file.text();

  ctx.session.text = file__text;

  return await preview__render(ctx);
});

bot.hears("♨ Render!", async (ctx) => {
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
});

bot.on("message", async (ctx) => {
  const message__text = ctx.message?.text;
  const regex = /#\w\w\w\w\w\w/;

  if (ctx.webAppData || regex.test(message__text)) {
    if (ctx.webAppData?.data) ctx.session.color = ctx.webAppData.data.text();
    else ctx.session.color = message__text.match(regex)[0];
    await ctx.replyWithMarkdownV2(`\`${ctx.session.color}\``);
  } else {
    await ctx.replyWithMarkdownV2(`\`${message__text}\``);
    ctx.session.text = message__text;
  }
  return await preview__render(ctx);
});

bot.help(async (ctx) => {
  const message = await template("command__help");
  ctx.reply(message);
});
