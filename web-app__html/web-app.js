import { hex } from "./iro__config.js";

export const app = window.Telegram.WebApp;
const storage = app.CloudStorage;

app.ready();
app.expand();

app.MainButton.isVisible = true;

app.onEvent("mainButtonClicked", () => {
  app.sendData(hex);
});
