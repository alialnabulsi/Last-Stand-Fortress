class Background extends Sprite {
  constructor(imageSrc) {
    super();
    this.image = new Image();
    this.image.src = imageSrc;
  }
  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
