class Spawner extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "SPAWNER";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.isSpawner = true;
    this.canPlaceBuildable = false;
    this.canPlaceObject = false;
    this.isEnemyPath = true;

    this.image = image;
    this.spawn = false;
    this.spawnTimer = 0;
    this.spawnCooldown = 120;
    this.spawnElapsedMs = 0;
    this.active = true;
    this.spawnedCount = 0;

    this.frame = 0;
    this.frameCount = 5;
    this.counter = 0;
  }

  getSpawnData() {
    const panel = this.findPanelSprite();
    const defense = panel ? panel.defenseState : null;
    const remaining = defense
      ? typeof defense.enemiesRemaining === "number"
        ? defense.enemiesRemaining
        : defense.enemyRemaining
      : null;
    return {
      enemyLevel:
        defense && typeof defense.enemyLevel === "number"
          ? defense.enemyLevel
          : 1,
      enemyHp:
        defense && typeof defense.enemyHp === "number" ? defense.enemyHp : 1,
      enemySpeed:
        defense && typeof defense.enemySpeed === "number"
          ? defense.enemySpeed
          : 1,
      enemiesRemaining: typeof remaining === "number" ? remaining : 0,
    };
  }

  canSpawn() {
    const panel = this.findPanelSprite();
    if (!panel || !panel.defenseState) return false;
    const defense = panel.defenseState;
    const state = defense.state;
    const remaining =
      typeof defense.enemiesRemaining === "number"
        ? defense.enemiesRemaining
        : defense.enemyRemaining;
    return (
      state === "UNDER_ATTACK" && typeof remaining === "number" && remaining > 0
    );
  }

  update(arrayOfSprites) {
    const panel = this.findPanelSprite();
    this.spawn = this.canSpawn();

    if (!this.spawn) {
      this.spawnElapsedMs = 0;
      return false;
    }

    if (panel && !panel.canRuntimeUpdate()) return false;

    this.animateSpawner();
    this.spawnEnemies(arrayOfSprites, panel);
    return false;
  }

  spawnEnemies(arrayOfSprites, panel) {
    if (!panel || !this.game || !Array.isArray(arrayOfSprites)) return;

    const wave = panel.getWaveRuntimeState();
    if (!wave || wave.spawnedEnemies >= wave.totalEnemies) return;

    if (!this.lastSpawnTickAt) this.lastSpawnTickAt = performance.now();
    const now = performance.now();
    this.spawnElapsedMs += now - this.lastSpawnTickAt;
    this.lastSpawnTickAt = now;

    const spawnDelayMs = (wave.spawnDelaySeconds || 1) * 1000;
    if (this.spawnElapsedMs < spawnDelayMs) return;

    this.spawnElapsedMs = 0;

    const enemy = new Enemy(
      this.x,
      this.y,
      this.size,
      wave.currentEnemyLevel,
      this.game.currentGameLevel ? this.game.currentGameLevel.utils : null,
      {
        maxHp: wave.enemyHp,
        speed: wave.enemySpeed,
        damage: wave.enemyDamage,
      },
    );

    enemy.game = this.game;
    this.game.addSprite(enemy);
    this.spawnedCount += 1;
    panel.onEnemySpawned(enemy);
  }

  findPanelSprite() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    for (let i = 0; i < this.game.arrayOfSprites.length; i++) {
      const sprite = this.game.arrayOfSprites[i];
      if (sprite instanceof Panel) return sprite;
    }
    return null;
  }
  animateSpawner() {
    this.counter++;
    if (this.counter % 20 === 0)
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
