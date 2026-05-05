class Grid extends Sprite {
  constructor(cellSize, sprites, utils) {
    super();

    this.map = utils.MAP.map_1;
    this.rows = this.map.length;
    this.cols = this.map[0].length;

    this.cellSize = cellSize;
    this.TILE_TYPES = utils.TILE_TYPES;
    this.images = utils.Images;

    this.createGrid(sprites);
  }

  getTileImage(tileType) {
    switch (tileType) {
      case this.TILE_TYPES.GRASS:
        return this.images.Grass;

      case this.TILE_TYPES.BUILDABLE:
        return this.images.Buildable;

      case this.TILE_TYPES.BLOCKED:
        return this.images.Blocked;

      case this.TILE_TYPES.TOWN_HALL:
        return this.images.TownHall;

      case this.TILE_TYPES.PATH:
        return this.images.Path;

      case this.TILE_TYPES.WATER:
        return this.images.Water;

      case this.TILE_TYPES.FOREST:
        return this.images.Forest;

      case this.TILE_TYPES.SPAWNER:
        return this.images.Spawner;

      case this.TILE_TYPES.TROOP_ZONE:
        return this.images.TroopZone;

      case this.TILE_TYPES.RESOURCE_ZONE:
        return this.images.ResourceZone;

      default:
        return this.images.Grass;
    }
  }

  createGrid(sprites) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tileType = this.map[row][col];

        const x = col * this.cellSize;
        const y = row * this.cellSize;

        const image = this.getTileImage(tileType);

       

        sprites.push(new Cell(x, y, this.cellSize, this.cellSize));
      }
    }
  }

  update() {}

  draw(ctx) {}
}
