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
    this.isBuildableObject = false;
    this.selected = false;
    this.active = true;
    this.image = itemConfig.image || null;
    this.placeholderColor = itemConfig.placeholderColor || "#8f6d3a";
    this.frameWidth = itemConfig.frameWidth || null;
    this.frameHeight = itemConfig.frameHeight || null;
    this.idleFrameStart = itemConfig.idleFrameStart || 0;
    this.idleFrameCount = itemConfig.idleFrameCount || itemConfig.frameCount || 1;
    this.attackFrameStart = itemConfig.attackFrameStart || this.idleFrameStart;
    this.attackFrameCount = itemConfig.attackFrameCount || this.idleFrameCount;
    this.frameDurationMs = itemConfig.frameDurationMs || 140;
    this.animationFrame = 0;
    this.animationElapsedMs = 0;
    this.activeAnimation = "idle";
    this.attackAnimationUntil = 0;
    this.lastRuntimeAt = performance.now();
  }

  findPanel() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    return this.game.arrayOfSprites.find((sprite) => sprite instanceof Panel) || null;
  }

  getActiveAnimation() {
    return this.attackAnimationUntil > performance.now()
      ? {
          name: "attack",
          frameStart: this.attackFrameStart,
          frameCount: this.attackFrameCount,
        }
      : {
          name: "idle",
          frameStart: this.idleFrameStart,
          frameCount: this.idleFrameCount,
        };
  }

  updateAnimation(deltaMs) {
    const animation = this.getActiveAnimation();
    if (this.activeAnimation !== animation.name) {
      this.activeAnimation = animation.name;
      this.animationFrame = 0;
      this.animationElapsedMs = 0;
    }
    if (animation.frameCount <= 1) return;

    this.animationElapsedMs += Math.max(0, deltaMs);
    while (this.animationElapsedMs >= this.frameDurationMs) {
      this.animationElapsedMs -= this.frameDurationMs;
      this.animationFrame = (this.animationFrame + 1) % animation.frameCount;
    }
  }

  getCurrentFrameIndex() {
    const animation = this.getActiveAnimation();
    return animation.frameStart + (this.animationFrame % Math.max(1, animation.frameCount));
  }

  getSheetColumns() {
    if (!this.frameWidth || !this.image || !this.image.naturalWidth) return 1;
    return Math.max(1, Math.floor(this.image.naturalWidth / this.frameWidth));
  }

  canDrawImage() {
    return !!(
      this.image &&
      this.image.complete &&
      (typeof this.image.naturalWidth !== "number" || this.image.naturalWidth > 0)
    );
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    this.updateAnimation(delta);
    return false;
  }

  draw(ctx) {
    if (this.canDrawImage()) {
      if (this.frameWidth && this.frameHeight) {
        const frameIndex = this.getCurrentFrameIndex();
        const columns = this.getSheetColumns();
        const sourceX = (frameIndex % columns) * this.frameWidth;
        const sourceY = Math.floor(frameIndex / columns) * this.frameHeight;
        ctx.drawImage(
          this.image,
          sourceX,
          sourceY,
          this.frameWidth,
          this.frameHeight,
          this.x,
          this.y,
          this.size,
          this.size,
        );
        return;
      }
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
