class Grass extends Sprite {
  constructor(x, y, size, image) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;

  }

  update() {
  
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      0,
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