import { Telegraf } from "telegraf";
const { message } = require("telegraf/filters");

import template from "../telegram-bot__template-messages";

console.log(await template("command__start"));

export const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const message = await template("command__start");
  ctx.reply(message);
});

bot.help(async (ctx) => {
  const message = await template("command__help");
  ctx.reply(message);
});

bot.on(message("sticker"), (ctx) => ctx.reply("👍"));

bot.hears("hi", (ctx) => ctx.reply("Hey there"));
