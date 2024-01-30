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
        ["EMOJI (´｡• ᵕ •｡`)"],
        [Markup.button.webApp("♦ Изменить цвет", process.env.WEB_APP_URL)],
        ["♨ Render!"],
      ]),
    }
  );
});

bot.on("message", async (ctx) => {
  if (!ctx.session) ctx.session = {};

  const message__text = ctx.message?.text;
  const regex = /#\w\w\w\w\w\w/;

  let username = ctx.message.from.username;
  if (!username) username = ctx.message.id;

  if (ctx.webAppData || regex.test(message__text)) {
    // TODO Сохранить в информацию в память сессии
    let hex;

    if (ctx.webAppData?.data) hex = ctx.webAppData.data.text();
    else hex = message__text.match(regex)[0];

    ctx.session.color = hex;

    await ctx.replyWithMarkdownV2(`\`${hex}\``);

    await ctx.replyWithPhoto({
      source: await ImageContoller.getPreview(username, ctx.session),
    });

    // await ctx.replyWithPhoto({
    //   source: await ImageContoller.getPreview__color(hex),
    // });
  } else {
    // TODO Сохранить в информацию в память сессии
    await ctx.replyWithMarkdownV2(`\`${message__text}\``);

    console.log(message__text);
    ctx.session.text = message__text;

    await ctx.replyWithPhoto({
      source: await ImageContoller.getPreview(username, ctx.session),
    });

    // await ctx.replyWithPhoto({
    //   source: await ImageContoller.getPreview__text(message__text, username),
    // });
  }
});

bot.help(async (ctx) => {
  const message = await template("command__help");
  ctx.reply(message);
});
