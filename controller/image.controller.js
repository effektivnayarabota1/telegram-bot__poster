import sharp from "sharp";

export default class ImageContoller {
  static async getPreview({ color, text }) {
    console.log("get all view");
    console.log("get text in folder");
  }

  static async getPreview__color(color) {
    const buffer = await sharp("./static/lepestochek__raster_72-ppt.png")
      .composite([
        {
          input: {
            create: {
              width: 720,
              height: 720,
              channels: 3,
              background: color,
            },
          },
          tile: true,
          blend: "colour-dodge",
        },
      ])
      .resize(512, 512, {
        fit: "inside",
      })
      .extend({
        top: 284,
        bottom: 284,
        left: 284,
        right: 284,
        extendWith: "repeat",
      })
      .webp()
      .toBuffer();

    return buffer;
  }
}
