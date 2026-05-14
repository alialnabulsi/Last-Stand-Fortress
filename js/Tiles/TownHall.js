class TownHall extends Sprite {
  constructor(x, y, size, image, level = 1, row, col, utils) {
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
    this.utils = utils || null;

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
      this.utils && this.utils.TownHallData
        ? this.utils.TownHallData
        : this.getActiveLevel() &&
      this.getActiveLevel().utils &&
      this.getActiveLevel().utils.TownHallData
        ? this.getActiveLevel().utils.TownHallData
        : null;

    return {
      maxHp:
        townHallData && typeof townHallData.maxHp === "number"
          ? townHallData.maxHp
          : 1,
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
  getActiveLevel() {
    if (!this.game || !Array.isArray(this.game.levels)) return null;
    return this.game.levels[this.game.currentLevelIndex] || null;
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
