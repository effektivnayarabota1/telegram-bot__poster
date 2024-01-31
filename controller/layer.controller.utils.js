import ImageUtils from "./image.controller.utils";

export default class Layer {
  constructor({
    buffer,
    width,
    height,
    dpi = 72,
    top_center__mm,
    left_center__mm,
    bleed__mm = 0,
  }) {
    this.buffer = buffer;
    this.width__px = width;
    this.height__px = height;
    this.dpi = dpi;
    this.top_center__mm = top_center__mm;
    this.left_center__mm = left_center__mm;
    this.bleed__mm = 0;
  }

  get left() {
    this.left_center__px = ImageUtils.cvt__mm_px(
      this.left_center__mm,
      this.dpi
    );
    const bleed__px = ImageUtils.cvt__mm_px(this.bleed__mm, this.dpi);

    return ImageUtils.number__fixed(
      this.left_center__px - this.width__px / 2 + bleed__px
    );
  }

  get top() {
    this.top_center__px = ImageUtils.cvt__mm_px(this.top_center__mm, this.dpi);
    const bleed__px = ImageUtils.cvt__mm_px(this.bleed__mm, this.dpi);

    return ImageUtils.number__fixed(
      this.top_center__px - this.height__px / 2 + bleed__px
    );
  }

  getLeft(width__px, bleed__mm = 0) {
    this.left_center__px = ImageUtils.cvt__mm_px(
      this.left_center__mm,
      this.dpi
    );
    const bleed__px = ImageUtils.cvt__mm_px(bleed__mm, this.dpi);

    return ImageUtils.number__fixed(
      this.left_center__px - width__px / 2 + bleed__px
    );
  }
  getTop(height__px, bleed__mm = 0) {
    this.top_center__px = ImageUtils.cvt__mm_px(this.top_center__mm, this.dpi);
    const bleed__px = ImageUtils.cvt__mm_px(bleed__mm, this.dpi);

    return ImageUtils.number__fixed(
      this.top_center__px - height__px / 2 + bleed__px
    );
  }
}
