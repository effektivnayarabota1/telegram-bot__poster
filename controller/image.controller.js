import sharp from "sharp";

export default class ImageContoller {
  static getHeight__aspectRatio(width, aspectRatio) {
    console.log(width);
    console.log(aspectRatio);
    const height = Number.parseFloat(width / aspectRatio).toFixed(0);
    return Number(height);
  }

  static async getMetadata(path) {
    this.image__metadata = await sharp(path).metadata();
    return;
  }

  static async getWidth(path) {
    if (!this.image__metadata) await this.getMetadata(path);
    return this.image__metadata.width;
  }

  static async getHeight(path) {
    if (!this.image__metadata) await this.getMetadata(path);
    return this.image__metadata.height;
  }

  static async getPreview({ color, text }) {
    console.log("get all view");
    console.log("get text in folder");
  }

  static async getPreview__color(color) {
    const image__path = "./static/lepestochek__raster_72-ppt.png";

    const image__width = await this.getWidth(image__path);
    const image__height = await this.getHeight(image__path);

    const aspectRatio = image__width / image__height;

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
      .resize(1080, this.getHeight__aspectRatio(image__width, aspectRatio), {
        fit: "inside",
      })
      // .extend({
      //   top: 284,
      //   bottom: 284,
      //   left: 284,
      //   right: 284,
      //   extendWith: "repeat",
      // })
      .webp()
      .toBuffer();

    return buffer;
  }
}
