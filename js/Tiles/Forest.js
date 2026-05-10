class Forest extends Sprite {
  constructor(x, y, size, image, row, col) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;
    this.isMapTile = true;
    this.tileType = "FOREST";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceBuildable = false;
    this.canPlaceObject = false;
    this.isEnemyPath = false;

    this.sourceSize = 40;
    this.animation = { image: image.image1, frame: 0, frameCount: 5, counter: Math.floor(Math.random() * 180), speed: 120 };
    this.noAnimation = { image: image.image2, frame: 0, frameCount: 5 };
    this.randomType = Math.floor(Math.random() * 6) + 1;
    this.useAnimatedTree = this.randomType === 6;
    if (!this.useAnimatedTree) this.noAnimation.frame = this.randomType - 1;
  }

  update() { if (this.useAnimatedTree) this.animateTrees(); }
  animateTrees() { this.animation.counter++; if (this.animation.counter % this.animation.speed === 0) this.animation.frame = (this.animation.frame + 1) % this.animation.frameCount; }
  draw(ctx) { if (this.useAnimatedTree) this.drawAnimatedTree(ctx); else this.drawForestObject(ctx); }
  drawAnimatedTree(ctx) { if (!this.animation.image || !this.animation.image.complete) return; ctx.drawImage(this.animation.image, this.animation.frame * this.sourceSize, 0, this.sourceSize, this.sourceSize, this.x, this.y, this.size, this.size); }
  drawForestObject(ctx) { if (!this.noAnimation.image || !this.noAnimation.image.complete) return; ctx.drawImage(this.noAnimation.image, this.noAnimation.frame * this.sourceSize, 0, this.sourceSize, this.sourceSize, this.x, this.y, this.size, this.size); }
}
