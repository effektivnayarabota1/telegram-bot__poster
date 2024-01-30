import sharp from "sharp";

import Layer from "./layer.controller.utils";
import ImageUtils from "./image.controller.utils";

const path__font = "RobotoCondensed-VariableFont_wght.ttf";

export default class ImageContoller {
  static async getPreview(username, { color, text }) {
    console.log(username, color, text);
    let buffer__result, buffer__background, buffer__text;

    if (color) {
      buffer__background = await this.getImageBuffer__color({ color });
    } else {
      buffer__background = await this.getImage({});
    }

    buffer__result = sharp(buffer__background);

    buffer__result = await this.getImageBuffer__text(buffer__result, {
      username,
      text,
    });

    return await buffer__result.webp().toBuffer();
  }

  static async getImage({ dpi = 72, bleed__mm = 0 }) {
    const image__path = ImageUtils.getImagePath(dpi, bleed__mm);

    const buffer = await sharp(image__path).png().toBuffer();

    return buffer;
  }

  static async createBlendLayer({
    image__width,
    image__height,
    color,
    dpi = 72,
    bleed__mm = 0,
  }) {
    const bleed__px = ImageUtils.getBleed__px(dpi, bleed__mm);
    const padding__px = ImageUtils.getPadding__px(dpi);

    return await sharp({
      create: {
        width: image__width + bleed__px - padding__px,
        height: image__height + bleed__px - padding__px,
        channels: 3,
        background: color,
      },
    })
      .png()
      .toBuffer();
  }

  static async getImageBuffer__text(buffer, { text, username, dpi = 72 }) {
    if (!username) throw new Error("username not found");

    const {
      buffer: autographLayer__buffer,
      width: autographLayer__width,
      height: autographLayer__height,
    } = await this.getLayerBuffer__autograph(username);

    const autographLayer = new Layer({
      buffer: autographLayer__buffer,
      width: autographLayer__width,
      height: autographLayer__height,
      top_center__mm: 72,
      left_center__mm: 54,
      dpi,
    });

    buffer.composite([
      {
        input: autographLayer.buffer,
        left: autographLayer.left,
        top: autographLayer.top,
      },
    ]);

    return buffer;
  }

  static async getLayerBuffer__autograph(username) {
    const date__now_ru = ImageUtils.getDate();
    const text = `@${username}    ${date__now_ru}`;

    const layer__autograph = await sharp({
      text: {
        // text,
        text: `<span foreground="gray">${text}</span>`,
        channels: 3,
        font: "RobotoCondensed bold italic",
        fontfile: path__font,
        align: "left",
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

    return layer__autograph;
  }

  static async getLayerBuffer__text(text, dpi) {
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

  static async getImageBuffer__color({ color, dpi = 72, bleed__mm = 0 }) {
    const image__path = ImageUtils.getImagePath(dpi, bleed__mm);

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
      .png()
      .toBuffer();

    return buffer;
  }

  static async createTextLayer({
    image__width,
    image__height,
    text,
    dpi = 72,
    bleed__mm = 5,
  }) {
    const path__font = "RobotoCondensed-VariableFont_wght.ttf";
  }

  static async _getLayerBuffer__text(text, username) {
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

  // static async getPreview__color(color) {
  //   const image__path = path.dpi__72;
  //
  //   const image__width = await ImageUtils.getWidth(image__path);
  //   const image__height = await ImageUtils.getHeight(image__path);
  //
  //   const blendLayer = await this.createBlendLayer({
  //     image__width,
  //     image__height,
  //     color,
  //   });
  //
  //   const buffer = await sharp(image__path)
  //     .composite([
  //       {
  //         input: blendLayer,
  //         gravity: "southwest",
  //         blend: "colour-dodge",
  //       },
  //     ])
  //     .webp()
  //     .toBuffer();
  //
  //   return buffer;
  // }
}
