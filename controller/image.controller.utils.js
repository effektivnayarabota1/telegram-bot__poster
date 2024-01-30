import sharp from "sharp";

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

  static getBleed__px(dpi, bleed__mm = 5) {
    return number__fixed(this.cvt__mm_px(bleed__mm, dpi));
  }
  static getPadding__px(dpi, padding__mm = 10) {
    return number__fixed(this.cvt__mm_px(padding__mm, dpi));
  }
}
