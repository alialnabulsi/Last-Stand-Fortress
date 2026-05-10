class Grass extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "GRASS";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceBuildable = true;
    this.canPlaceObject = false;
    this.isEnemyPath = false;

    this.image = image;
  }

  update() {}

  draw(ctx) {
    ctx.drawImage(this.image, 0, 0, 40, 40, this.x, this.y, this.size, this.size);
  }
}
