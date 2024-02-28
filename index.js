// import { server } from "./web-app";
import { bot } from "./telegram-bot";

await bot.launch();
bot.catch((e) => {
  console.log(e);
  process.exit(1);
});

// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));
