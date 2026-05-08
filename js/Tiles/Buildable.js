class Buildable extends Sprite {
  constructor(x, y, size, image) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;

   this.frame = 0;
  }

  update() {
    
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