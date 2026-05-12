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
    this.active = true;
    this.spawnedCount = 0;

    this.frame = 0;
    this.frameCount = 5;
    this.counter = 0;
  }

  getSpawnData() {
    const defense =
      this.game && this.game.panel ? this.game.panel.defenseState : null;
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
    if (!this.game || !this.game.panel || !this.game.panel.defenseState)
      return false;
    const defense = this.game.panel.defenseState;
    const state = defense.state;
    const remaining =
      typeof defense.enemiesRemaining === "number"
        ? defense.enemiesRemaining
        : defense.enemyRemaining;
    return (
      state === "UNDER_ATTACK" && typeof remaining === "number" && remaining > 0
    );
  }

  update() {
    if (this.spawn) this.animateSpawner();
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
