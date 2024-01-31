import sharp from "sharp";

const path = {
  dpi__72: "./static/lepestochek__72dpi.png",
  dpi__300: "./static/lepestochek__300dpi.png",
  dpi__300_bleed5: "./static/lepestochek__300dpi_bleed-5mm.png",
  dpi__600: "./static/lepestochek__600dpi.png",
  dpi__600_bleed5: "./static/lepestochek__600dpi_bleed-5mm.png",
};

const number__fixed = (number) => {
  const string = Number.parseFloat(number).toFixed(0);
  return Number(string);
};

export default class ImageUtils {
  static number__fixed(number) {
    const string = Number.parseFloat(number).toFixed(0);
    return Number(string);
  }
  static cvt__mm_px(mm, dpi) {
    const px = (dpi * mm) / 25.4;
    return number__fixed(px);
  }

  static getDate() {
    const date__now = new Date(Date.now());
    return date__now.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }

  static getImagePath(dpi = 72, bleed__mm = 0) {
    return path[`dpi__${dpi}${bleed__mm ? `_bleed${bleed__mm}` : ""}`];
  }

  static async getMetadata(path) {
    return await sharp(path).metadata();
  }
  static async getWidth(path) {
    const metadata = await this.getMetadata(path);
    return Number(metadata.width);
  }
  static async getHeight(path) {
    const metadata = await this.getMetadata(path);
    return Number(metadata.height);
  }
  static getHeight__aspectRatio(width, aspectRatio) {
    // const height = Number.parseFloat(width / aspectRatio).toFixed(0);
    const height = number__fixed(width / aspectRatio);
    return height;
  }

  static getTextPostion__left(width) {
    // 44mm
    // const left = Number.parseFloat((width / 3) * 2).toFixed(0);
    const left = number__fixed((width / 3) * 1);
    return Number(left);
  }
  static getTextPostion__top(height) {
    // 280mm
    // const top = Number.parseFloat((height / 3) * 2).toFixed(0);
    const top = number__fixed((height / 3) * 2);
    return Number(top);
  }

  static getBleed__px(dpi, bleed__mm) {
    const bleed__px = this.cvt__mm_px(bleed__mm, dpi);
    return number__fixed(bleed__px);
  }
  static getPadding__px(dpi, padding__mm = 10) {
    return number__fixed(this.cvt__mm_px(padding__mm, dpi));
  }
}
