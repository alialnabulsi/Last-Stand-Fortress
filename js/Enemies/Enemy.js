class Enemy extends Sprite {
  constructor(x, y, size, level, utils, config = {}) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.utils = utils;

    this.isEnemy = true;
    this.enemyLevel = level || 1;

    const enemyConfig = this.getEnemyConfig(config);
    this.maxHp = enemyConfig.maxHp;
    this.hp = enemyConfig.hp;
    this.speed = enemyConfig.speed;
    this.damage = enemyConfig.damage;

    this.alive = true;
    this.reachedTownHall = false;

    this.frame = 0;
    this.frameWidth = enemyConfig.frameWidth || 40;
    this.frameHeight = enemyConfig.frameHeight || 40;
    this.image = enemyConfig.image;
  }

  getEnemyConfig(config) {
    const enemyData = this.utils && this.utils.EnemyData ? this.utils.EnemyData : {};
    const byLevel = enemyData.byLevel || {};
    const fallback = enemyData.default || {};
    const levelData = byLevel[this.enemyLevel] || fallback;

    return {
      image: config.image || levelData.image || fallback.image || null,
      maxHp: config.maxHp || levelData.maxHp || fallback.maxHp || 1,
      hp: config.hp || levelData.maxHp || fallback.maxHp || 1,
      speed: config.speed || levelData.speed || fallback.speed || 1,
      damage: config.damage || levelData.damage || fallback.damage || 1,
      frameWidth: levelData.frameWidth || fallback.frameWidth || 40,
      frameHeight: levelData.frameHeight || fallback.frameHeight || 40,
    };
  }

  update(arrayOfSprites) {
    const panel = this.findPanelSprite(arrayOfSprites);
    if (panel && !panel.canRuntimeUpdate()) return false;

    // TODO: Implement path movement toward Town Hall in the next task.
    // TODO: Implement enemy attack/combat interactions in a future task.
    return !this.alive;
  }

  findPanelSprite(arrayOfSprites) {
    if (!Array.isArray(arrayOfSprites)) return null;
    for (let i = 0; i < arrayOfSprites.length; i++) {
      const sprite = arrayOfSprites[i];
      if (sprite instanceof Panel) return sprite;
    }
    return null;
  }

  draw(ctx) {
    if (!this.alive) return;

    if (this.image) {
      ctx.drawImage(
        this.image,
        this.frame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.size,
        this.size,
      );
      return;
    }

    ctx.save();
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }
}
