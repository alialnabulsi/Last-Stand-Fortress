class Path extends Sprite {
  constructor(x, y, size, image, direction) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;

    this.sourceSize = 40;

    this.direction = direction;

    this.frameX = 0;
    this.frameY = 0;

    this.assignFrames();
  }

  assignFrames() {
    switch (this.direction) {
      case 40: // cross
        this.frameX = 2;
        this.frameY = 0;
        break;

      case 41: // horizontal
        this.frameX = 0;
        this.frameY = 0;
        break;

      case 42: // vertical
        this.frameX = 1;
        this.frameY = 0;
        break;

      case 43: // corner 1
        this.frameX = 3;
        this.frameY = 0;
        break;

      case 44: // corner 2
        this.frameX = 4;
        this.frameY =0;
        break;

      case 45: // corner 3
        this.frameX = 5;
        this.frameY = 0;
        break;

      case 46: // corner 4
        this.frameX = 6;
        this.frameY = 0;
        break;

      default:
        this.frameX = 0;
        this.frameY = 0;
        break;
    }
  }

  update() {}

  draw(ctx) {
    if (!this.image || !this.image.complete) return;
    ctx.drawImage(
      
      this.image,
      this.frameX * this.sourceSize,
      this.frameY * this.sourceSize,
      this.sourceSize,
      this.sourceSize,
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}