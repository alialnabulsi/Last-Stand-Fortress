class Water extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "WATER";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceFoundation = false;
    this.canPlaceObject = false;
    this.isEnemyPath = false;

    this.image = image;

    this.frame = 0;
    this.frameCount = 4;
    this.counter = 0;
  }

  update() {
    this.counter++;
    if (this.counter % 30 === 0)
      this.frame = (this.frame + 1) % this.frameCount;
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
      this.size,
    );
  }
}
