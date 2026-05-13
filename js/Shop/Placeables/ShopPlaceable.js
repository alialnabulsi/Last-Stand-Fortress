class ShopPlaceable extends Sprite {
  constructor(anchor, itemConfig, game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.anchor = anchor;
    this.itemId = itemConfig.id;
    this.itemType = itemConfig.type || itemConfig.id;
    this.displayName = itemConfig.fullName || itemConfig.label || itemConfig.id;
    this.cost = itemConfig.cost || 0;
    this.unlockLevel = itemConfig.unlockLevel || 1;
    this.level = 1;
    this.row = typeof anchor.row === "number" ? anchor.row : Math.floor(anchor.y / anchor.size);
    this.col = typeof anchor.col === "number" ? anchor.col : Math.floor(anchor.x / anchor.size);
    this.tileRow = this.row;
    this.tileCol = this.col;
    this.x = anchor.x;
    this.y = anchor.y;
    this.size = anchor.size || 40;
    this.width = this.size;
    this.height = this.size;
    this.isMapTile = false;
    this.isPlacedObject = true;
    this.isShopPlaceable = true;
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

    ctx.save();
    ctx.fillStyle = this.placeholderColor;
    ctx.fillRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
    ctx.strokeStyle = "#1e1e1e";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
    ctx.restore();
  }
}

class Buildable extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.isFoundation = true;
    this.canPlaceBuildable = false;
    this.canPlaceObject = true;
    this.occupied = false;
    this.placedObjectId = null;
    this.sourceSize = 40;
    this.wasMouseDown = false;
    this.isHovered = false;
    this.flashUntil = 0;
  }

  tryPlaceSelectedItem(arrayOfSprites) {
    const panel = this.findPanel();
    if (!panel) return;
    if (!panel.shopState.selectedItem) {
      panel.setMessage("No item selected. Select a building/tower, then click Buildable.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!panel.canPlaceDuringCurrentPhase()) {
      panel.setMessage("Placement is only allowed during preparation or under attack.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (panel.isRuntimePaused()) {
      panel.setMessage("Cannot place while on break.");
      return;
    }
    if (panel.shopState.selectedItem.id === "buildable_tile") {
      panel.setMessage("Buildable can only be placed on grass, not on another Buildable.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (this.occupied || !this.canPlaceObject) {
      panel.setMessage("This Buildable is occupied. Choose an empty Buildable foundation.");
      this.flashUntil = performance.now() + 220;
      return;
    }

    const itemId = panel.shopState.selectedItemId;
    const itemConfig = panel.shopRules[itemId];
    if (!itemConfig) return;
    if (!panel.isShopItemUnlocked(itemId)) {
      panel.setMessage(`${panel.shopState.selectedItem.fullName} is locked.`);
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!panel.canAfford(itemConfig.cost)) {
      panel.setMessage(`Not enough gold for ${panel.shopState.selectedItem.fullName}. Need ${itemConfig.cost}G.`);
      this.flashUntil = performance.now() + 220;
      return;
    }

    const Constructor = ShopPlaceableRegistry[itemId];
    if (!Constructor || Constructor === Buildable) {
      panel.setMessage("This item cannot be placed here yet.");
      this.flashUntil = performance.now() + 220;
      return;
    }

    const placed = new Constructor(
      this,
      { ...panel.shopState.selectedItem, ...itemConfig },
      panel.game,
      panel.utils,
    );
    if (!placed) {
      panel.setMessage("Placement failed.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    panel.game.addSprite(placed);
    this.occupied = true;
    this.placedObjectId = itemId;
    if (!panel.spendGold(itemConfig.cost)) {
      this.occupied = false;
      this.placedObjectId = null;
      const placedIndex = panel.game.arrayOfSprites.indexOf(placed);
      if (placedIndex >= 0) panel.game.arrayOfSprites.splice(placedIndex, 1);
      panel.setMessage("Not enough gold.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    panel.setMessage(`${panel.shopState.selectedItem.fullName} placed on Buildable foundation. Spend gold: ${itemConfig.cost}G.`);
    this.flashUntil = performance.now() + 180;
  }

  update(arrayOfSprites, keys, mouse) {
    const isInside =
      mouse.x >= this.x &&
      mouse.x <= this.x + this.size &&
      mouse.y >= this.y &&
      mouse.y <= this.y + this.size;
    this.isHovered = isInside;
    const isMouseDown = !!mouse?.down;
    const justPressed = isMouseDown && !this.wasMouseDown;
    if (justPressed && isInside) this.tryPlaceSelectedItem(arrayOfSprites);
    this.wasMouseDown = isMouseDown;
    return false;
  }

  draw(ctx) {
    super.draw(ctx);

    const highlightActive = this.isHovered || this.flashUntil > performance.now();
    if (highlightActive) {
      ctx.save();
      ctx.strokeStyle = this.occupied ? "rgba(255, 90, 90, 0.95)" : "rgba(120, 255, 145, 0.95)";
      ctx.lineWidth = this.occupied ? 2 : 3;
      ctx.strokeRect(this.x + 1, this.y + 1, this.size - 2, this.size - 2);
      ctx.restore();
    }
  }
}

class GoldMine extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.productionAmount = itemConfig.productionAmount || 0;
    this.productionIntervalMs = itemConfig.productionIntervalMs || 6000;
    this.productionElapsedMs = 0;
  }

  update() {
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

class Barracks extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.troopCapacityBonus = itemConfig.troopCapacityBonus || 0;
  }

  update() {
    this.lastRuntimeAt = performance.now();
    return false;
  }
}

class DefenseTower extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.range = itemConfig.range || 100;
    this.damage = itemConfig.damage || 1;
    this.attackCooldownMs = itemConfig.attackCooldownMs || 1000;
    this.targetType = itemConfig.targetType || "ground";
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

const ShopPlaceableRegistry = {
  buildable_tile: Buildable,
  gold_mine: GoldMine,
  barracks: Barracks,
  archer: Archer,
  cannon: Cannon,
  wizard: Wizard,
  inferno_tower: Inferno,
};

const PlacedObject = ShopPlaceable;
const PlacedObjectRegistry = ShopPlaceableRegistry;
