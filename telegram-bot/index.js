import { Telegraf, Markup } from "telegraf";
const { message } = require("telegraf/filters");

import template from "../telegram-bot__template-messages";

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const message1 = await template("command__start-1");
  await ctx.reply(message1);
  await ctx.replyWithPhoto(
    {
      source: "./static/lepestochek__raster_72-ppt.png",
    },
    {
      caption: "Окей, эту графику мы будем красить.",
      ...Markup.keyboard([
        Markup.button.webApp("Цвет", process.env.WEB_APP_URL),
        "Текст",
      ]),
    }
  );
});

bot.on("message", async (ctx) => {
  const message__text = ctx.message?.text;
  // const regex = new RegExp(`/#\\w\\w\\w\\w\\w\\w`);
  const regex = /#\w\w\w\w\w\w/;
  if (ctx.webAppData || regex.test(message__text)) {
    let hex;
    if (ctx.webAppData?.data) hex = ctx.webAppData.data.text();
    else hex = message__text.match(regex)[0];
    await ctx.reply(hex);
  } else {
    await ctx.reply("message");
  }
});

bot.on(
  message("web_app_data", async (ctx) => {
    ctx.reply("data");
    console.log("getData");
    console.log(ctx);
    // assuming sendData was called with a JSON string

    console.log(data);
    console.log(text);
  })
);

bot.help(async (ctx) => {
  const message = await template("command__help");
  ctx.reply(message);
});