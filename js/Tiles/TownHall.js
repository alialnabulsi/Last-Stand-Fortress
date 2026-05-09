class TownHall extends Sprite {
  constructor(x, y, size, image, level = 1) {
    super();

    this.x = x;
    this.y = y;
    this.size = size; // should be 80 if TownHall takes 2x2 cells
    this.image = image;
    this.isMapTile = true;

    this.sourceSize = 80;

    this.level = level; // 1, 2, 3, or 4
    this.frame = this.level - 1; // level 1 = frame 0
    this.isTownHall = true;
    this.maxHp = 1000;
    this.hp = this.maxHp;
  }

  setLevel(level) {
    this.level = Math.max(1, Math.min(4, level));
    this.frame = this.level - 1;
  }

  update() {}

  draw(ctx) {
    if (!this.image || !this.image.complete) return;

    ctx.drawImage(
      this.image,
      this.frame * this.sourceSize,
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
