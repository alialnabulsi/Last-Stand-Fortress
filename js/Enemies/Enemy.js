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
    this.movementCompleted = false;

    this.routePoints = [];
    this.routeIndex = 0;
    this.routeBuilt = false;

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
    if (!panel || !this.shouldMove(panel)) return false;

    if (!this.routeBuilt) this.buildRouteFromLevel();

    if (this.routePoints.length === 0 || this.routeIndex >= this.routePoints.length) {
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
    if (!startTile || !townHallTile) return;

    const pathTilesToTownHall = this.findPathTilesToTownHall(level, startTile, townHallTile);
    if (pathTilesToTownHall.length === 0) return;

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
    if (this.reachedTownHall) return;

    this.reachedTownHall = true;
    this.movementCompleted = true;
    this.alive = false;

    if (panel && typeof panel.onEnemyReachedTownHall === "function") {
      panel.onEnemyReachedTownHall(this);
    } else if (panel && panel.defenseState) {
      panel.defenseState.activeEnemies = Math.max(0, panel.defenseState.activeEnemies - 1);
    }

    // TODO: Apply Town Hall damage when Town Hall damage system is implemented.
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
