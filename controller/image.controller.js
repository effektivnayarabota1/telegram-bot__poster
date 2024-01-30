import sharp from "sharp";

import Layer from "./layer.controller.utils";
import ImageUtils from "./image.controller.utils";

const path__font = "RobotoCondensed-VariableFont_wght.ttf";

export default class ImageContoller {
  static async renderImage({ username, color, text, dpi, bleed__mm }) {
    const layer__background = await this.getImage({ dpi, bleed__mm });
    const layer__color = await this.getLayerBuffer__color(layer__background, {
      color,
      dpi,
      bleed__mm,
    });
    const layer__text = await this.getLayerBuffer__text(layer__background, {
      text,
      dpi,
      bleed__mm,
    });
    const layer__autograph = await this.getLayerBuffer__autograph(
      layer__background,
      { username, dpi, bleed__mm }
    );

    return sharp(layer__background).composite([
      layer__text,
      layer__autograph,
      layer__color,
    ]);
  }

  static async getPreview({ username, color = "#FF7F50", text = "(^=◕ᴥ◕=^)" }) {
    return (await this.renderImage({ username, color, text }))
      .webp()
      .toBuffer();
  }

  static async getRender__print({
    username,
    color = "#FF7F50",
    text = "(^=◕ᴥ◕=^)",
  }) {
    const buffer = await this.renderImage({
      username,
      color,
      text,
      dpi: 300,
      bleed__mm: 5,
    });

    const buffer__png = await buffer.png().toBuffer();

    return await sharp(buffer__png).png().toBuffer();
    // return await buffer.resize(200, 300).png().toBuffer();
  }

  static async getRender__wallpaper(
    { username, color = "#FF7F50", text = "(^=◕ᴥ◕=^)" },
    width__new = 600
  ) {
    const buffer = await this.renderImage({
      username,
      color,
      text,
      // dpi: 300,
    });

    const buffer__png = await buffer.png().toBuffer();

    const { width, height } = await ImageUtils.getMetadata(buffer__png);

    const ratio = width / width__new;
    const height__new = height / ratio;

    const top = ImageUtils.number__fixed(((3000 - height__new) / 3) * 2);
    const right = ImageUtils.number__fixed(((1400 - width__new) / 3) * 2);
    const bottom = ImageUtils.number__fixed(3000 - height__new - top);
    const left = ImageUtils.number__fixed(1400 - width__new - right);

    return await sharp(buffer__png)
      .resize({ width: width__new, fit: "inside" })
      .extend({ top, right, bottom, left, extendWith: "mirror" })
      .png()
      .toBuffer();
    // return await buffer.resize(200, 300).png().toBuffer();
  }

  static async getImage({ dpi = 72, bleed__mm = 0 }) {
    const image__path = ImageUtils.getImagePath(dpi, bleed__mm);
    const buffer = await sharp(image__path).png().toBuffer();
    return buffer;
  }

  static async getLayerBuffer__color(
    buffer,
    { color, dpi = 72, bleed__mm = 0 }
  ) {
    const { width: image__width, height: image__height } =
      await ImageUtils.getMetadata(buffer);

    const bleed__px = ImageUtils.getBleed__px(dpi, bleed__mm);
    const padding__px = ImageUtils.getPadding__px(dpi);

    const colorLayer = {};
    colorLayer.buffer = await sharp({
      create: {
        width: image__width - padding__px,
        height: image__height - padding__px,
        channels: 3,
        background: color,
      },
    })
      .png()
      .toBuffer();

    return {
      input: colorLayer.buffer,
      gravity: "southwest",
      // blend: "colour-dodge",
      // blend: "multiply",
      // blend: "screen",
      blend: "overlay",
    };
  }

  static async getLayerBuffer__autograph(
    buffer,
    { username, dpi = 72, bleed__mm = 0 }
  ) {
    if (!username) throw new Error("username not found");

    const date__now_ru = ImageUtils.getDate();
    const text = `@${username}    ${date__now_ru}`;

    const {
      buffer: autographLayer__buffer,
      width: autographLayer__width,
      height: autographLayer__height,
    } = await sharp({
      text: {
        // text,
        text: `<span foreground="#a3a3a3">${text}</span>`,
        channels: 3,
        font: "RobotoCondensed light italic",
        fontfile: path__font,
        align: "left",
        dpi: dpi * (108 / 72),
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

    const autographLayer = new Layer({
      buffer: autographLayer__buffer,
      width: autographLayer__width,
      height: autographLayer__height,
      top_center__mm: 72,
      left_center__mm: 54,
      dpi,
      bleed__mm,
    });

    return {
      input: autographLayer.buffer,
      left: autographLayer.left,
      top: autographLayer.top,
    };
  }

  static async getLayerBuffer__text(buffer, { text, dpi = 72, bleed__mm = 0 }) {
    const textField__width = ImageUtils.cvt__mm_px(120, dpi);
    const textField__height = ImageUtils.cvt__mm_px(240, dpi);

    const {
      buffer: textLayer__buffer,
      width: textLayer__width,
      height: textLayer__height,
    } = await sharp({
      text: {
        // text,
        text: `<span foreground="#525252">${text}</span>`,
        channels: 3,
        // fontfile: path__font,
        // font: "Roboto bold",
        font: "RobotoCondensed bold",
        align: "center",
        width: textField__width,
        height: textField__height,
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

    const textLayer = new Layer({
      buffer: textLayer__buffer,
      width: textLayer__width,
      height: textLayer__height,
      top_center__mm: 300,
      left_center__mm: 88,
      dpi,
      bleed__mm,
    });

    return {
      input: textLayer.buffer,
      left: textLayer.left,
      top: textLayer.top,
    };
  }

  // static async getLayerBuffer__color(
  //   buffer,
  //   { color, dpi = 72, bleed__mm = 0 }
  // ) {
  //   const image__path = ImageUtils.getImagePath(dpi, bleed__mm);
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
  //     .png()
  //     .toBuffer();
  //
  //   return buffer;
  // }
}
