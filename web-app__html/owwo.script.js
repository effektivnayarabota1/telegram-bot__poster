async function loadIroScript() {
  return new Promise((resolve, reject) => {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.jsdelivr.net/npm/@jaames/iro@5";

    head.appendChild(script);

    script.onload = () => resolve(iro);
  });
}

async function loadTelegramScript() {
  return new Promise((resolve, reject) => {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://telegram.org/js/telegram-web-app.js";

    head.appendChild(script);

    script.onload = () => resolve(window.Telegram.WebApp);
  });
}

const asyncWrapper = async () => {
  const iro = await loadIroScript();
  const app = await loadTelegramScript();

  app.ready();
  app.expand();

  app.MainButton.isVisible = true;

  app.onEvent("mainButtonClicked", () => {
    app.sendData(hex);
  });

  const colorPicker = new iro.ColorPicker(".card-element", {
    layout: [
      {
        component: iro.ui.Box,
      },
      {
        component: iro.ui.Slider,
        options: {
          sliderType: "hue",
        },
      },
    ],
  });

  const cardElement = document.querySelector(".card-element");
  cardElement.style.justifyContent = "center";

  colorPicker.on("color:change", function (color) {
    let text_color = "#ffffff";
    hex = color.hexString;
    const value = color.value;

    if (value >= 50) text_color = "#000000";

    app.MainButton.setText(`ВЫБРАТЬ ${hex}`);
    app.MainButton.setParams({ color: hex, text_color });
  });
};

asyncWrapper();
