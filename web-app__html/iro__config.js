import { app } from "./web-app.js";

var colorPicker = new iro.ColorPicker("#picker", {
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

export let hex;

colorPicker.on("color:change", function (color) {
  let text_color = "#ffffff";
  hex = color.hexString;
  const value = color.value;

  if (value >= 50) text_color = "#000000";

  app.MainButton.setText(`ВЫБРАТЬ ${hex}`);
  app.MainButton.setParams({ color: hex, text_color });
});
