class Water extends Sprite {
  constructor(x, y, size, image) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;

    this.frame = 0;
    this.frameCount = 4;
    this.counter = 0;
  }

  update() {
    this.counter++;

    if (this.counter % 10 === 0) {
      this.frame = (this.frame + 1) % this.frameCount;
    }
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      this.frame * 40,
      0,
      40,
      40,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}