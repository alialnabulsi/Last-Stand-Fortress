class Buildable extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.isFoundation = true;
    this.isBuildableObject = true;
    this.canPlaceFoundation = false;
    this.canPlaceObject = true;
    this.occupied = false;
    this.placedObjectId = null;
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

    const selected = getSelectedShopPlaceableConfig(panel);
    if (!selected) return;
    if (selected.placement !== "buildable") {
      panel.setMessage(`${selected.fullName} cannot be placed on a Buildable foundation.`);
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!canPlaceSelectedShopItem(panel, selected, this)) {
      this.flashUntil = performance.now() + 220;
      return;
    }

    const placed = createShopPlaceableFromRegistry(selected.id, this, panel, selected);
    if (!placed) {
      panel.setMessage("Placement failed.");
      this.flashUntil = performance.now() + 220;
      return;
    }
    if (!panel.spendGold(selected.cost)) {
      panel.setMessage("Not enough gold.");
      this.flashUntil = performance.now() + 220;
      return;
    }

    addShopPlaceableSprite(panel.game, placed, this);
    this.occupied = true;
    this.placedObjectId = selected.id;
    panel.setMessage(`${selected.fullName} placed on Buildable foundation. Spend gold: ${selected.cost}G.`);
    this.flashUntil = performance.now() + 180;
  }

  update(arrayOfSprites, keys, mouse) {
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    this.updateAnimation(delta);
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
