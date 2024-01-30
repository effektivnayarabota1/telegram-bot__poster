import sharp from "sharp";

import ImageUtils from "./image.controller.utils";

const path = {
  dpi__72: "./static/lepestochek__72dpi.png",
  dpi__300: "./static/lepestochek__300dpi.png",
  dpi__300_bleed5: "./static/lepestochek__300dpi_bleed-5mm.png",
  dpi__600: "./static/lepestochek__600dpi.png",
  dpi__600_bleed5: "./static/lepestochek__600dpi_bleed-5mm.png",
};

export default class ImageContoller {
  static async getPreview({ color, text }) {
    console.log("get all view");
    console.log("get text in folder");
  }

  static async createBlendLayer({
    image__width,
    image__height,
    color,
    dpi = 72,
    bleed__mm = 5,
  }) {
    const bleed__px = ImageUtils.getBleed__px(dpi);
    const padding__px = ImageUtils.getPadding__px(dpi);

    return await sharp({
      create: {
        width: image__width - padding__px,
        height: image__height - padding__px,
        channels: 3,
        background: color,
      },
    })
      .png()
      .toBuffer();
  }

  static async getPreview__color(color) {
    const image__path = path.dpi__72;

    const image__width = await ImageUtils.getWidth(image__path);
    const image__height = await ImageUtils.getHeight(image__path);

    const blendLayer = await this.createBlendLayer({
      image__width,
      image__height,
      color,
    });

    const buffer = await sharp(image__path)
      .composite([
        {
          input: blendLayer,
          gravity: "southwest",
          blend: "colour-dodge",
        },
      ])
      .webp()
      .toBuffer();

    return buffer;
  }

  static async createAutographLayer({ username }) {
    const path__font = "RobotoCondensed-VariableFont_wght.ttf";

    const date__now = new Date(Date.now());
    const date__now_ru = date__now.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    let text;
    if (username) text = `@${username}    ${date__now_ru}`;

    const width__px = ImageUtils.cvt__mm_px(84, 72);

    const autographLayer = await sharp({
      text: {
        // text,
        text: `<span foreground="gray">${text}</span>`,
        channels: 3,
        font: "RobotoCondensed bold italic",
        fontfile: path__font,
        align: "left",
        // width: width__px,
        dpi: 108,
        rgba: true,
      },
    })
      .png()
      .rotate(300, { background: "#ffffff00" })
      .toBuffer()
      .then(async function (buffer) {
        const { width, height } = await ImageUtils.getMetadata(buffer);
        return {
          buffer,
          width,
          height,
        };
      });

    return autographLayer;
  }

  static async createTextLayer({
    image__width,
    image__height,
    text,
    dpi = 72,
    bleed__mm = 5,
  }) {
    const path__font = "RobotoCondensed-VariableFont_wght.ttf";

    const textLayer__width = ImageUtils.cvt__mm_px(120, dpi);
    const textLayer__height = ImageUtils.cvt__mm_px(240, dpi);

    const textLayer = await sharp({
      text: {
        text,
        channels: 3,
        // font: "RobotoCondensed",
        // fontfile: path__font,
        font: "Roboto",
        align: "center",
        width: textLayer__width,
        height: textLayer__height,
        // dpi: 72,
        // justify: true,
        rgba: true,
      },
    })
      .png()
      .rotate(30, { background: "#ffffff00" })
      .toBuffer()
      .then(async function (buffer) {
        const { width, height } = await ImageUtils.getMetadata(buffer);
        return {
          buffer,
          width,
          height,
        };
      });

    return textLayer;
  }

  static async getPreview__text(text, username) {
    const image__path = path.dpi__72;
    const dpi = 72;

    const image__width = await ImageUtils.getWidth(image__path);
    const image__height = await ImageUtils.getHeight(image__path);

    const textLayer__positionLeft_center = ImageUtils.cvt__mm_px(88, dpi);
    const textLayer__positionTop_center = ImageUtils.cvt__mm_px(300, dpi);

    const {
      buffer: textLayer__buffer,
      width: textLayer__width,
      height: textLayer__height,
    } = await this.createTextLayer({
      image__width,
      image__height,
      text,
      username,
    });

    const textLayer__positionLeft_LT = ImageUtils.number__fixed(
      textLayer__positionLeft_center - textLayer__width / 2
    );
    const textLayer__positionTop_LT = ImageUtils.number__fixed(
      textLayer__positionTop_center - textLayer__height / 2
    );

    const {
      buffer: autographLayer__buffer,
      width: autographLayer__width,
      height: autographLayer__height,
    } = await this.createAutographLayer({
      username,
    });

    const autographLayer__positionLeft_center = ImageUtils.cvt__mm_px(54, dpi);
    const autographLayer__positionTop_center = ImageUtils.cvt__mm_px(72, dpi);

    const autographLayer__positionLeft_LT = ImageUtils.number__fixed(
      autographLayer__positionLeft_center - autographLayer__width / 2
    );
    const autographLayer__positionTop_LT = ImageUtils.number__fixed(
      autographLayer__positionTop_center - autographLayer__height / 2
    );

    const buffer = await sharp(image__path)
      .composite([
        {
          input: textLayer__buffer,
          left: textLayer__positionLeft_LT,
          top: textLayer__positionTop_LT,
        },
        {
          input: autographLayer__buffer,
          left: autographLayer__positionLeft_LT,
          top: autographLayer__positionTop_LT,
        },
      ])
      .webp()
      .toBuffer();

    return buffer;
  }

  static async createColorLayer(image, bleed = 0) {}

  static async createImageLayer(image, bleed = 0) {}
}
