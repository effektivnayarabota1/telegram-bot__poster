import sharp from "sharp";

export default class ImageContoller {
  static getHeight__aspectRatio(width, aspectRatio) {
    const height = Number.parseFloat(width / aspectRatio).toFixed(0);
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
    const left = Number.parseFloat((width / 3) * 2).toFixed(0);
    return Number(left);
  }

  static getTextPostion__top(height) {
    const top = Number.parseFloat((height / 3) * 2).toFixed(0);
    return Number(top);
  }

  static async getPreview({ color, text }) {
    console.log("get all view");
    console.log("get text in folder");
  }

  static async getPreview__color(color) {
    const image__path = "./static/lepestochek__raster_72-ppt.png";

    const image__width = await this.getWidth(image__path);
    const image__height = await this.getHeight(image__path);

    // const aspectRatio = image__width / image__height;

    const buffer = await sharp(image__path)
      .composite([
        {
          input: {
            create: {
              width: image__width,
              height: image__height,
              channels: 3,
              background: color,
            },
          },
          tile: true,
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
}
