class TownHall extends Sprite {
  constructor(x, y, size, image, level = 1, row, col) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.image = image;
    this.isMapTile = true;
    this.tileType = "TOWN_HALL";
    this.row = typeof row === "number" ? row : Math.floor(y / 40);
    this.col = typeof col === "number" ? col : Math.floor(x / 40);
    this.canPlaceBuildable = false;
    this.canPlaceObject = false;
    this.isEnemyPath = false;

    this.sourceSize = 80;
    this.level = level;
    this.frame = this.level - 1;
    this.isTownHall = true;
    this.maxHp = 1000;
    this.hp = this.maxHp;
  }
  setLevel(level) { this.level = Math.max(1, Math.min(4, level)); this.frame = this.level - 1; }
  update() {}
  draw(ctx) { if (!this.image || !this.image.complete) return; ctx.drawImage(this.image, this.frame * this.sourceSize, 0, this.sourceSize, this.sourceSize, this.x, this.y, this.size, this.size); }
}
