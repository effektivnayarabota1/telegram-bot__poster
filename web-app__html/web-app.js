export const app = window.Telegram.WebApp;
const storage = app.CloudStorage;

console.log(storage);

app.ready();
app.expand();

app.MainButton.isVisible = true;
