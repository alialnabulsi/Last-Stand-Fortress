class Grass extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();
    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "GRASS";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceBuildable = true;
    this.canPlaceObject = false;
    this.isEnemyPath = false;

    this.image = image;
    this.wasMouseDown = false;
    this.isHovered = false;
    this.flashUntil = 0;
  }

  findPanel(arrayOfSprites) {
    return arrayOfSprites.find((sprite) => sprite instanceof Panel) || null;
  }

  tryPlaceBuildable(arrayOfSprites) {
    const panel = this.findPanel(arrayOfSprites);
    if (!panel) return;
    const selected = panel.shopState.selectedItem;
    if (!selected) {
      panel.setMessage("No item selected. Select Buildable first, then click grass.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (selected.id !== "buildable_tile") {
      panel.setMessage(`${selected.fullName} needs a Buildable foundation. Place Buildable on grass first.`);
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!panel.canPlaceDuringCurrentPhase()) {
      panel.setMessage("Placement is only allowed during preparation or under attack.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!panel.isShopItemUnlocked(selected.id)) {
      panel.setMessage(`${selected.fullName} is locked.`);
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!panel.canAfford(selected.cost)) {
      panel.setMessage(`Not enough gold for ${selected.fullName}. Need ${selected.cost}G.`);
      this.flashUntil = performance.now() + 220;
      return;
    }

    const hasBuildableAlready = arrayOfSprites.some(
      (sprite) =>
        sprite instanceof Buildable && sprite.row === this.row && sprite.col === this.col,
    );
    if (hasBuildableAlready) {
      panel.setMessage("This grass tile already has a Buildable foundation.");
      this.flashUntil = performance.now() + 220;
      return;
    }

    const buildable = new Buildable(
      this.x,
      this.y,
      this.size,
      panel.utils.Images.Buildable,
      this.row,
      this.col,
    );
    panel.game.addSprite(buildable);
    panel.spendGold(selected.cost);
    panel.setMessage(`Buildable placed on grass. Spend gold: ${selected.cost}G.`);
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
    if (justPressed && isInside) this.tryPlaceBuildable(arrayOfSprites);
    this.wasMouseDown = isMouseDown;
    return false;
  }

  draw(ctx) {
    ctx.drawImage(
      this.image,
      0,
      0,
      40,
      40,
      this.x,
      this.y,
      this.size,
      this.size,
    );

    const highlightActive = this.isHovered || this.flashUntil > performance.now();
    if (highlightActive) {
      ctx.save();
      ctx.strokeStyle = "rgba(120, 255, 145, 0.7)";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x + 1, this.y + 1, this.size - 2, this.size - 2);
      ctx.restore();
    }
  }
}
