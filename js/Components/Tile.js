class Tile extends Sprite {
  constructor(TILE_TYPES, x, y, type, size, image) {
    super();

    this.TILE_TYPES = TILE_TYPES;
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;

    this.image = image; // image should already be loaded

    this.sheetTileSize = 50;
    this.gameTime = Math.floor(Math.random() * 500);

    this.frameX = 0;
    this.frameY = 0;

    this.setFrame();
  }

  setFrame() {
    switch (this.type) {
      case this.TILE_TYPES.GRASS:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.BUILDABLE:
       this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.BLOCKED:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.TOWN_HALL:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.PATH:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.WATER:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.FOREST:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.SPAWNER:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.TROOP_ZONE:
        this.frameX = 0;
        this.frameY = 0;
        break;

      case this.TILE_TYPES.RESOURCE_ZONE:
        this.frameX = 0;
        this.frameY = 0;
        break;
    }
  }

  update() {
    /*
    this.gameTime += 16;

    if (this.type === this.TILE_TYPES.WATER) {
      this.frameX = Math.floor(this.gameTime / 300) % 4;
    }

    if (this.type === this.TILE_TYPES.SPAWNER) {
      this.frameX = Math.floor(this.gameTime / 200) % 4;
    }
      */
  }

  draw(ctx) {
    if (!this.image || !this.image.complete) return;

    ctx.drawImage(
      this.image,
      this.frameX * this.sheetTileSize,
      this.frameY * this.sheetTileSize,
      this.sheetTileSize,
      this.sheetTileSize,
      this.x,
      this.y,
      this.size,
      this.size,
    );
  }
}
