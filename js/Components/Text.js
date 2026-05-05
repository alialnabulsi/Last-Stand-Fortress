class Text extends Sprite {
  constructor(x, y, text, options = {}) {
    super();
    this.x = x;
    this.y = y;
    this.text = text;

    this.font = options.font || "30px Arial";
    this.color = options.color || "#ffffff";
    this.align = options.align || "center";
    this.baseline = options.baseline || "middle";
    this.maxWidth = options.maxWidth || null;

    this.shadow = options.shadow || false;
    this.stroke = options.stroke || false;
  }

  update() {}

  draw(ctx) {
    ctx.save();

    if (this.shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 3;
    }

    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;

    if (this.stroke) {
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 4;

      if (this.maxWidth) {
        ctx.strokeText(this.text, this.x, this.y, this.maxWidth);
      } else {
        ctx.strokeText(this.text, this.x, this.y);
      }
    }

    if (this.maxWidth) {
      ctx.fillText(this.text, this.x, this.y, this.maxWidth);
    } else {
      ctx.fillText(this.text, this.x, this.y);
    }

    ctx.restore();
  }
}
