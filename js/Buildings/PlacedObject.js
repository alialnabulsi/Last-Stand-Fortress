class PlacedObject extends Sprite {
  constructor(tile, itemConfig, game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.tile = tile;
    this.itemId = itemConfig.id;
    this.itemType = itemConfig.type || itemConfig.id;
    this.displayName = itemConfig.fullName || itemConfig.label || itemConfig.id;
    this.cost = itemConfig.cost || 0;
    this.unlockLevel = itemConfig.unlockLevel || 1;
    this.level = 1;
    this.tileRow = tile.row;
    this.tileCol = tile.col;
    this.x = tile.x;
    this.y = tile.y;
    this.size = tile.size || 40;
    this.width = this.size;
    this.height = this.size;
    this.isPlacedObject = true;
    this.isBuildableObject = true;
    this.selected = false;
    this.active = true;
    this.image = itemConfig.image || null;
    this.placeholderColor = itemConfig.placeholderColor || "#8f6d3a";
    this.lastRuntimeAt = performance.now();
  }

  findPanel() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    return this.game.arrayOfSprites.find((sprite) => sprite instanceof Panel) || null;
  }

  update() {
    this.lastRuntimeAt = performance.now();
    return false;
  }

  draw(ctx) {
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
      return;
    }
    // TODO: Replace placeholder with final sprite sheet asset.
    ctx.save();
    ctx.fillStyle = this.placeholderColor;
    ctx.fillRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
    ctx.strokeStyle = "#1e1e1e";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
    ctx.restore();
  }
}

class GoldMine extends PlacedObject {
  constructor(tile, itemConfig, game, utils) {
    super(tile, itemConfig, game, utils);
    this.productionAmount = itemConfig.productionAmount || 0;
    this.productionIntervalMs = itemConfig.productionIntervalMs || 6000;
    this.productionElapsedMs = 0;
  }

  update(arrayOfSprites) {
    const panel = this.findPanel();
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    if (!panel || !panel.canRuntimeUpdate || !panel.canRuntimeUpdate()) return false;
    this.productionElapsedMs += Math.max(0, delta);
    while (this.productionElapsedMs >= this.productionIntervalMs) {
      panel.addGold(this.productionAmount);
      this.productionElapsedMs -= this.productionIntervalMs;
    }
    return false;
  }
}

class Barracks extends PlacedObject {
  update() {
    // TODO: Add troop production/defender spawning behavior when troop system is implemented.
    this.lastRuntimeAt = performance.now();
    return false;
  }
}

class DefenseTower extends PlacedObject {
  constructor(tile, itemConfig, game, utils) {
    super(tile, itemConfig, game, utils);
    this.range = itemConfig.range || 100;
    this.damage = itemConfig.damage || 1;
    this.attackCooldownMs = itemConfig.attackCooldownMs || 1000;
    this.cooldownElapsedMs = this.attackCooldownMs;
    this.lastAttackAt = 0;
  }

  findTarget() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;
    const enemies = this.game.arrayOfSprites.filter((sprite) => sprite && sprite.isEnemy === true && typeof sprite.isAlive === "function" && sprite.isAlive());
    let target = null;
    let minDistance = Infinity;
    for (const enemy of enemies) {
      const ex = enemy.x + enemy.size / 2;
      const ey = enemy.y + enemy.size / 2;
      const distance = Math.hypot(ex - centerX, ey - centerY);
      if (distance <= this.range && distance < minDistance) {
        minDistance = distance;
        target = enemy;
      }
    }
    return target;
  }

  update() {
    const panel = this.findPanel();
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    if (!panel || !panel.canRuntimeUpdate || !panel.canRuntimeUpdate()) return false;
    if (panel.defenseState.state !== "UNDER_ATTACK") return false;
    this.cooldownElapsedMs += Math.max(0, delta);
    if (this.cooldownElapsedMs < this.attackCooldownMs) return false;
    const target = this.findTarget();
    if (!target) return false;
    this.cooldownElapsedMs = 0;
    this.lastAttackAt = now;
    target.takeDamage(this.damage);
    return false;
  }
}

class Archer extends DefenseTower {}
class Cannon extends DefenseTower {}
class Wizard extends DefenseTower {}
class Inferno extends DefenseTower {}

const PlacedObjectRegistry = {
  gold_mine: GoldMine,
  barracks: Barracks,
  archer: Archer,
  cannon: Cannon,
  wizard: Wizard,
  inferno_tower: Inferno,
};
