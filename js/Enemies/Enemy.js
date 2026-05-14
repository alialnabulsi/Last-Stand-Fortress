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
    this.handled = false;
    this.isDying = false;
    this.deathAnimationDone = false;
    this.reachedTownHall = false;
    this.hasDamagedTownHall = false;
    this.movementCompleted = false;

    this.routePoints = [];
    this.routeIndex = 0;
    this.routeBuilt = false;

    this.animationConfig = this.getAnimationConfig();
    this.frame = this.animationConfig.walkFrames[0] || 0;
    this.animationFrameIndex = 0;
    this.animationElapsedMs = 0;
    this.lastAnimationAt = this.getNow();
    this.frameWidth = enemyConfig.frameWidth || 40;
    this.frameHeight = enemyConfig.frameHeight || 40;
    this.image = enemyConfig.image;
  }

  getAnimationConfig() {
    const enemyData = this.utils && this.utils.EnemyData ? this.utils.EnemyData : {};
    const animation = enemyData.animation || {};
    return {
      walkFrames: Array.isArray(animation.walkFrames) && animation.walkFrames.length > 0
        ? animation.walkFrames
        : [3, 4, 5, 6, 7, 8],
      deathFrames: Array.isArray(animation.deathFrames) && animation.deathFrames.length > 0
        ? animation.deathFrames
        : [11, 12, 13],
      frameDurationMs: animation.frameDurationMs || 110,
      deathFrameDurationMs: animation.deathFrameDurationMs || animation.frameDurationMs || 135,
    };
  }

  getNow() {
    return typeof performance !== "undefined" && performance.now ? performance.now() : Date.now();
  }

  getAnimationDelta() {
    const now = this.getNow();
    const delta = now - this.lastAnimationAt;
    this.lastAnimationAt = now;
    return Math.max(0, delta);
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
    if (this.isDying) return this.updateDeathAnimation();

    const panel = this.findPanelSprite(arrayOfSprites);
    if (!panel || !this.shouldMove(panel) || !this.isAlive()) return false;

    this.updateWalkAnimation();

    if (!this.routeBuilt) this.buildRouteFromLevel();

    if (this.routePoints.length === 0) {
      this.handlePathFailure(panel);
      return !this.alive;
    }

    if (this.routeIndex >= this.routePoints.length) {
      this.markReachedTownHall(panel);
      return !this.alive;
    }

    this.moveAlongRoute();

    if (this.routeIndex >= this.routePoints.length) {
      this.markReachedTownHall(panel);
      return !this.alive;
    }

    return !this.alive;
  }

  updateWalkAnimation() {
    const frames = this.animationConfig.walkFrames;
    if (frames.length <= 1) {
      this.frame = frames[0] || 0;
      this.getAnimationDelta();
      return;
    }

    this.animationElapsedMs += this.getAnimationDelta();
    while (this.animationElapsedMs >= this.animationConfig.frameDurationMs) {
      this.animationElapsedMs -= this.animationConfig.frameDurationMs;
      this.animationFrameIndex = (this.animationFrameIndex + 1) % frames.length;
    }
    this.frame = frames[this.animationFrameIndex];
  }

  updateDeathAnimation() {
    const frames = this.animationConfig.deathFrames;
    if (this.deathAnimationDone || frames.length === 0) return true;

    this.animationElapsedMs += this.getAnimationDelta();
    while (this.animationElapsedMs >= this.animationConfig.deathFrameDurationMs) {
      this.animationElapsedMs -= this.animationConfig.deathFrameDurationMs;
      this.animationFrameIndex += 1;
      if (this.animationFrameIndex >= frames.length) {
        this.deathAnimationDone = true;
        return true;
      }
    }
    this.frame = frames[Math.min(this.animationFrameIndex, frames.length - 1)];
    return false;
  }

  shouldMove(panel) {
    if (!panel || !panel.defenseState) return false;
    const state = panel.defenseState.state;
    if (panel.canRuntimeUpdate && !panel.canRuntimeUpdate()) return false;
    return state === "UNDER_ATTACK";
  }

  buildRouteFromLevel() {
    this.routeBuilt = true;

    const level = this.game ? this.game.currentGameLevel : null;
    if (!level || !level.getTownHallTile || !level.getPathNeighbors) return;

    const startTile = this.findCurrentPathTile(level);
    const townHallTile = level.getTownHallTile();
    if (!startTile || !townHallTile) {
      console.warn("Enemy route build skipped: missing start or town hall tile.");
      return;
    }

    const pathTilesToTownHall = this.findPathTilesToTownHall(level, startTile, townHallTile);
    if (pathTilesToTownHall.length === 0) {
      console.warn("Enemy route build failed: no path to town hall.");
      return;
    }

    this.routePoints = pathTilesToTownHall.map((tile) => this.getTileCenter(tile));
    this.routePoints.push(this.getTownHallCenter(townHallTile));
    this.routeIndex = 0;
  }

  findCurrentPathTile(level) {
    const row = Math.floor((this.y + this.size / 2) / 40);
    const col = Math.floor((this.x + this.size / 2) / 40);
    const tile = level.getTileAt ? level.getTileAt(row, col) : null;
    if (tile && tile.isEnemyPath) return tile;

    const spawners = level.getSpawnerTiles ? level.getSpawnerTiles() : [];
    if (!Array.isArray(spawners) || spawners.length === 0) return null;

    let nearest = null;
    let nearestDist = Infinity;
    for (const spawner of spawners) {
      const d = Math.abs(spawner.x - this.x) + Math.abs(spawner.y - this.y);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = spawner;
      }
    }
    return nearest;
  }

  findPathTilesToTownHall(level, startTile, townHallTile) {
    const queue = [{ tile: startTile, path: [startTile] }];
    const visited = new Set([`${startTile.row},${startTile.col}`]);

    while (queue.length > 0) {
      const current = queue.shift();
      const tile = current.tile;

      if (this.isAdjacentToTownHall(tile, townHallTile)) return current.path;

      const neighbors = level.getPathNeighbors(tile.row, tile.col) || [];
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (visited.has(key)) continue;
        visited.add(key);
        queue.push({ tile: neighbor, path: current.path.concat(neighbor) });
      }
    }

    // TODO: Replace/adjust this when full route/path logic is implemented.
    return [];
  }

  isAdjacentToTownHall(tile, townHallTile) {
    if (!tile || !townHallTile) return false;
    const minRow = townHallTile.row;
    const maxRow = townHallTile.row + 1;
    const minCol = townHallTile.col;
    const maxCol = townHallTile.col + 1;

    const adjacent =
      (tile.row >= minRow && tile.row <= maxRow && (tile.col === minCol - 1 || tile.col === maxCol + 1)) ||
      (tile.col >= minCol && tile.col <= maxCol && (tile.row === minRow - 1 || tile.row === maxRow + 1));

    return adjacent;
  }

  moveAlongRoute() {
    const target = this.routePoints[this.routeIndex];
    if (!target) return;

    const currentCenterX = this.x + this.size / 2;
    const currentCenterY = this.y + this.size / 2;

    const dx = target.x - currentCenterX;
    const dy = target.y - currentCenterY;
    const distance = Math.hypot(dx, dy);

    if (distance <= this.speed) {
      this.x = target.x - this.size / 2;
      this.y = target.y - this.size / 2;
      this.routeIndex += 1;
      return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    this.x += nx * this.speed;
    this.y += ny * this.speed;
  }

  markReachedTownHall(panel) {
    if (this.reachedTownHall || this.handled) return;

    this.reachedTownHall = true;
    this.movementCompleted = true;
    this.alive = false;
    this.handled = true;

    const townHall = this.findTownHallSprite();
    if (townHall && !this.hasDamagedTownHall && typeof townHall.takeDamage === "function") {
      townHall.takeDamage(this.damage);
      this.hasDamagedTownHall = true;
    }

    if (panel && typeof panel.onEnemyReachedTownHall === "function") {
      panel.onEnemyReachedTownHall(this, townHall);
    } else if (panel && panel.defenseState) {
      panel.defenseState.activeEnemies = Math.max(0, panel.defenseState.activeEnemies - 1);
    }
  }
  handlePathFailure(panel) {
    if (this.handled) return;
    this.alive = false;
    this.handled = true;
    this.movementCompleted = true;
    if (panel && typeof panel.onEnemyPathFailed === "function") {
      panel.onEnemyPathFailed(this);
    } else if (panel && panel.defenseState) {
      panel.defenseState.activeEnemies = Math.max(0, panel.defenseState.activeEnemies - 1);
    }
  }

  isAlive() {
    return this.alive && !this.handled && !this.reachedTownHall && !this.isDying;
  }

  takeDamage(amount) {
    if (!this.isAlive()) return false;
    const damage = Math.max(0, amount || 0);
    if (damage <= 0) return false;
    this.hp = Math.max(0, this.hp - damage);
    if (this.hp <= 0) this.die();
    return true;
  }

  die() {
    if (!this.isAlive()) return;
    this.alive = false;
    this.handled = true;
    this.isDying = true;
    this.deathAnimationDone = false;
    this.animationFrameIndex = 0;
    this.animationElapsedMs = 0;
    this.lastAnimationAt = this.getNow();
    this.frame = this.animationConfig.deathFrames[0] || this.frame;
    const panel = this.findPanelSprite(this.game && this.game.arrayOfSprites ? this.game.arrayOfSprites : []);
    if (panel && typeof panel.onEnemyKilled === "function") panel.onEnemyKilled(this);
  }

  getTileCenter(tile) {
    return { x: tile.x + tile.size / 2, y: tile.y + tile.size / 2 };
  }

  getTownHallCenter(townHallTile) {
    return {
      x: townHallTile.x + townHallTile.size / 2,
      y: townHallTile.y + townHallTile.size / 2,
    };
  }

  findPanelSprite(arrayOfSprites) {
    if (!Array.isArray(arrayOfSprites)) return null;
    for (let i = 0; i < arrayOfSprites.length; i++) {
      const sprite = arrayOfSprites[i];
      if (sprite instanceof Panel) return sprite;
    }
    return null;
  }

  findTownHallSprite() {
    const level = this.game ? this.game.currentGameLevel : null;
    if (level && typeof level.getTownHallTile === "function") {
      const activeTownHall = level.getTownHallTile();
      if (activeTownHall && this.game && Array.isArray(this.game.arrayOfSprites) && this.game.arrayOfSprites.includes(activeTownHall)) {
        return activeTownHall;
      }
    }
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    for (let i = 0; i < this.game.arrayOfSprites.length; i++) {
      const sprite = this.game.arrayOfSprites[i];
      if (sprite && (sprite.isTownHall === true || (typeof TownHall !== "undefined" && sprite instanceof TownHall))) {
        return sprite;
      }
    }
    return null;
  }

  draw(ctx) {
    if (!this.isAlive() && !this.isDying) return;

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
