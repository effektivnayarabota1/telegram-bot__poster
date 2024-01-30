import sharp from "sharp";

const path = {
  dpi__72: "./static/lepestochek__72dpi.png",
  dpi__300: "./static/lepestochek__300dpi.png",
  dpi__300_bleed5: "./static/lepestochek__300dpi_bleed-5mm.png",
  dpi__600: "./static/lepestochek__600dpi.png",
  dpi__600_bleed5: "./static/lepestochek__600dpi_bleed-5mm.png",
};

const number__fixed = (number) => Number.parseFloat(number).toFixed(0);

export default class ImageContoller {
  static getHeight__aspectRatio(width, aspectRatio) {
    // const height = Number.parseFloat(width / aspectRatio).toFixed(0);
    const height = number__fixed(width / aspectRatio);
    return height;
  }

  static async getMetadata(path) {
    this.image__metadata = await sharp(path).metadata();
    return;
  }

  static async getWidth(path) {
    if (!this.image__metadata) await this.getMetadata(path);
    return Number(this.image__metadata.width);
  }

  static async getHeight(path) {
    if (!this.image__metadata) await this.getMetadata(path);
    return Number(this.image__metadata.height);
  }

  static getTextPostion__left(width) {
    // const left = Number.parseFloat((width / 3) * 2).toFixed(0);
    const left = number__fixed((width / 3) * 2);
    return Number(left);
  }

  static getTextPostion__top(height) {
    // const top = Number.parseFloat((height / 3) * 2).toFixed(0);
    const top = number__fixed((height / 3) * 2);
    return Number(top);
  }

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
    const paddim__mm = 10;

    const bleed__px = number__fixed((dpi * bleed__mm) / 25.4);
    const padding__px = number__fixed((dpi * paddim__mm) / 25.4);

    console.log(padding__px);

    // const layer__width =
    // const layer__heihgt =

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

    const image__width = await this.getWidth(image__path);
    const image__height = await this.getHeight(image__path);

    // const aspectRatio = image__width / image__height;

    const blendLayer = await this.createBlendLayer({
      image__width,
      image__height,
      color,
    });

    const buffer = await sharp(image__path)
      .composite([
        {
          input: blendLayer,
          // tile: true,
          gravity: "southwest",
          blend: "colour-dodge",
        },
      ])
      .webp()
      .toBuffer();

    return buffer;
  }

  static async getPreview__text(text) {
    const image__path = "./static/lepestochek__raster_72-ppt.png";

    const image__width = await this.getWidth(image__path);
    const image__height = await this.getHeight(image__path);

    const text__position_left = this.getTextPostion__left(image__width);
    const text__position_top = this.getTextPostion__top(image__height);

    const buffer = await sharp(image__path)
      .composite([
        {
          input: {
            text: {
              text: text,
            },
          },
          left: text__position_left,
          top: text__position_top,
        },
      ])
      .webp()
      .toBuffer();

    return buffer;
  }

  static async createColorLayer(image, bleed = 0) {}

  static async createImageLayer(image, bleed = 0) {}
}
