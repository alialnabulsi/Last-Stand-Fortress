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
    this.canPlaceFoundation = false;
    this.canPlaceObject = false;
    this.isEnemyPath = false;

    this.sourceSize = 80;
    this.level = level;
    this.frame = this.level - 1;
    this.isTownHall = true;
    this.hpConfig = this.resolveTownHallConfig();
    this.maxHp = this.hpConfig.maxHp;
    this.hp = this.maxHp;
    this.destroyed = false;
  }

  resolveTownHallConfig() {
    const townHallData =
      this.game &&
      this.game.currentGameLevel &&
      this.game.currentGameLevel.utils &&
      this.game.currentGameLevel.utils.TownHallData
        ? this.game.currentGameLevel.utils.TownHallData
        : null;

    return {
      maxHp:
        townHallData && typeof townHallData.maxHp === "number"
          ? townHallData.maxHp
          : 1000,
    };
  }

  takeDamage(amount) {
    if (this.destroyed) return this.getHPInfo();
    const damage = Math.max(0, Number(amount) || 0);
    this.hp = Math.max(0, this.hp - damage);
    if (this.hp <= 0) {
      this.destroyed = true;
    }
    return this.getHPInfo();
  }

  isDestroyed() {
    return this.destroyed;
  }

  getHPInfo() {
    return {
      hp: this.hp,
      maxHp: this.maxHp,
      destroyed: this.destroyed,
      level: this.level,
    };
  }

  resetHP() {
    this.maxHp = this.resolveTownHallConfig().maxHp;
    this.hp = this.maxHp;
    this.destroyed = false;
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
      this.size,
    );
  }
}
