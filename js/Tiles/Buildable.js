class Buildable extends Sprite {
  constructor(x, y, size, image) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;

    this.sourceSize = 40;
  }

  update() {}

  draw(ctx) {
    if (!this.image || !this.image.complete) return;

    ctx.drawImage(
      this.image,
      0,
      0,
      this.sourceSize,
      this.sourceSize,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}