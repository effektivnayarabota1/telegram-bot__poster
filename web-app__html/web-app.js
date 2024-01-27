import { hex } from "./iro__config.js";

export const app = window.Telegram.WebApp;
const storage = app.CloudStorage;

console.log(storage);

app.ready();
app.expand();

app.MainButton.isVisible = true;
app.MainButton.onClick(() => console.log("main button clicked"));

app.onEvent("mainButtonClicked", () => {
  app.sendData(hex);
});
