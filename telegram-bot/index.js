import { Telegraf, Markup, session } from "telegraf";
import { message } from "telegraf/filters";

import ImageContoller from "../controller/image.controller";
import template from "../telegram-bot__template-messages";

export const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

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
        // ["EMOJI (´｡• ᵕ •｡`)"],
        [Markup.button.webApp("♦ Изменить цвет", process.env.WEB_APP_URL)],
        ["♨ Render!"],
      ]),
    }
  );
});

bot.hears("♨ Render!", async (ctx) => {
  if (!ctx.session) ctx.session = {};

  let username = ctx.message.from.username;
  if (!username) username = ctx.message.id;
  ctx.session.username = username;

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__print(ctx.session),
    filename: "flower__print_a3__bledd_5mm.png",
  });

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__wallpaper(ctx.session),
    filename: "flower__wallpaper_1400x3000.png",
  });

  await ctx.replyWithDocument({
    source: await ImageContoller.getRender__wallpaper(ctx.session, 256),
    filename: "flower__wallpaper_1400x3000.png",
  });
});

bot.on("message", async (ctx) => {
  if (!ctx.session) ctx.session = {};

  const message__text = ctx.message?.text;
  const regex = /#\w\w\w\w\w\w/;

  let username = ctx.message.from.username;
  if (!username) username = ctx.message.id;
  ctx.session.username = username;

  if (ctx.webAppData || regex.test(message__text)) {
    if (ctx.webAppData?.data) ctx.session.color = ctx.webAppData.data.text();
    else ctx.session.color = message__text.match(regex)[0];
    await ctx.replyWithMarkdownV2(`\`${ctx.session.color}\``);
  } else {
    await ctx.replyWithMarkdownV2(`\`${message__text}\``);
    ctx.session.text = message__text;
  }

  try {
    return await ctx.replyWithPhoto({
      source: await ImageContoller.getPreview(ctx.session),
    });
  } catch (e) {
    return await ctx.reply(e.message);
  }
});

bot.help(async (ctx) => {
  const message = await template("command__help");
  ctx.reply(message);
});
