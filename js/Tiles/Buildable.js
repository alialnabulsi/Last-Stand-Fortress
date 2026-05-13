class Buildable extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "BUILDABLE";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceBuildable = false;
    this.canPlaceObject = true;
    this.isEnemyPath = false;

    this.occupied = false;
    this.placedObjectId = null;

    this.image = image;
    this.sourceSize = 40;
    this.wasMouseDown = false;
    this.isHovered = false;
    this.flashUntil = 0;
  }

  findPanel(arrayOfSprites) {
    return arrayOfSprites.find((sprite) => sprite instanceof Panel) || null;
  }

  tryPlaceSelectedItem(arrayOfSprites) {
    const panel = this.findPanel(arrayOfSprites);
    if (!panel || !panel.shopState.selectedItem) return;
    if (panel.isRuntimePaused()) {
      panel.setMessage("Cannot place while on break.");
      return;
    }
    if (this.occupied || !this.canPlaceObject) {
      panel.setMessage("This tile is already occupied.");
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
      panel.setMessage(`Not enough gold for ${panel.shopState.selectedItem.fullName}.`);
      this.flashUntil = performance.now() + 220;
      return;
    }

    const Constructor = PlacedObjectRegistry[itemId];
    if (!Constructor) {
      panel.setMessage("This item cannot be placed yet.");
      this.flashUntil = performance.now() + 220;
      return;
    }

    const placed = new Constructor(this, { ...panel.shopState.selectedItem, ...itemConfig }, panel.game, panel.utils);
    panel.game.addSprite(placed);
    this.occupied = true;
    this.placedObjectId = itemId;
    panel.spendGold(itemConfig.cost);
    panel.setMessage(`${panel.shopState.selectedItem.fullName} placed.`);
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
    if (!this.image || !this.image.complete) return;
    ctx.drawImage(
      this.image,
      0,
      0,
      this.sourceSize,
      this.sourceSize,
      this.x,
      this.y,
      this.size,
      this.size,
    );

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
