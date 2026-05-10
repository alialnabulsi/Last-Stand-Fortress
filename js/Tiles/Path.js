class Path extends Sprite {
  constructor(x, y, size, image, direction, row, col) {
    super();

    this.x = x;
    this.y = y;
    this.size = size;

    this.isMapTile = true;
    this.tileType = "PATH";
    this.row = typeof row === "number" ? row : Math.floor(y / size);
    this.col = typeof col === "number" ? col : Math.floor(x / size);
    this.canPlaceBuildable = false;
    this.canPlaceObject = false;
    this.isEnemyPath = true;

    this.image = image;
    this.sourceSize = 40;
    this.direction = direction;
    this.pathCode = direction;

    this.frameX = 0;
    this.frameY = 0;
    this.assignFrames();
  }
  assignFrames() { switch (this.direction) { case 40: this.frameX = 2; break; case 41: this.frameX = 0; break; case 42: this.frameX = 1; break; case 43: this.frameX = 3; break; case 44: this.frameX = 4; break; case 45: this.frameX = 5; break; case 46: this.frameX = 6; break; default: this.frameX = 0; } this.frameY = 0; }
  update() {}
  draw(ctx) { if (!this.image || !this.image.complete) return; ctx.drawImage(this.image, this.frameX * this.sourceSize, this.frameY * this.sourceSize, this.sourceSize, this.sourceSize, this.x, this.y, this.size, this.size); }
}
