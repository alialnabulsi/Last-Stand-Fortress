class Buildable extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "BUILDABLE";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceBuildable = false;
    this.canPlaceObject = true;
    this.isEnemyPath = false;

    this.isPlacedObject = true;
    this.occupied = false;

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
      this.size,
    );
  }
}
