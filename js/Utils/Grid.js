class Grid extends Sprite {
  constructor(cellSize, sprites, utils, map) {
    super();

    this.map = map || utils.MAP.map_1;
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

      case this.TILE_TYPES.TOWN_HALL:
        return this.images.TownHall;

      case this.TILE_TYPES.CROSS:
        return this.images.Path;

      case this.TILE_TYPES.HORZ:
        return this.images.Path;

      case this.TILE_TYPES.VERT:
        return this.images.Path;

      case this.TILE_TYPES.BRIGHT:
        return this.images.Path;

      case this.TILE_TYPES.BLEFT:
        return this.images.Path;

      case this.TILE_TYPES.TRIGHT:
        return this.images.Path;

      case this.TILE_TYPES.TLEFT:
        return this.images.Path;

      case this.TILE_TYPES.WATER:
        return this.images.Water;

      case this.TILE_TYPES.FOREST:
        return this.images.Forest;

      case this.TILE_TYPES.SPAWNER:
        return this.images.Spawner;

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
        switch (tileType) {
          case this.TILE_TYPES.GRASS:
            sprites.push(new Grass(x, y, this.cellSize, image, row, col));
            break;

          case this.TILE_TYPES.BUILDABLE:
            sprites.push(new Buildable(x, y, this.cellSize, image, row, col));
            break;

          case this.TILE_TYPES.TOWN_HALL:
            const isTopLeftTownHall =
              (row === 0 ||
                this.map[row - 1][col] !== this.TILE_TYPES.TOWN_HALL) &&
              (col === 0 ||
                this.map[row][col - 1] !== this.TILE_TYPES.TOWN_HALL);

            if (isTopLeftTownHall) {
              sprites.push(new TownHall(x, y, this.cellSize * 2, image, 1, row, col));
            }
            break;

          case this.TILE_TYPES.CROSS:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.CROSS, row, col),
            );
            break;
          case this.TILE_TYPES.HORZ:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.HORZ, row, col),
            );
            break;

          case this.TILE_TYPES.VERT:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.VERT, row, col),
            );
            break;
          case this.TILE_TYPES.BRIGHT:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.BRIGHT, row, col),
            );
            break;
          case this.TILE_TYPES.BLEFT:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.BLEFT, row, col),
            );
            break;
          case this.TILE_TYPES.TRIGHT:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.TRIGHT, row, col),
            );
            break;
          case this.TILE_TYPES.TLEFT:
            sprites.push(
              new Path(x, y, this.cellSize, image, this.TILE_TYPES.TLEFT, row, col),
            );
            break;

          case this.TILE_TYPES.WATER:
            sprites.push(new Water(x, y, this.cellSize, image, row, col));
            break;

          case this.TILE_TYPES.FOREST:
            sprites.push(new Forest(x, y, this.cellSize, image, row, col));
            break;

          case this.TILE_TYPES.SPAWNER:
            sprites.push(new Spawner(x, y, this.cellSize, image, row, col));
            break;


          default:
            sprites.push(new Grass(x, y, this.cellSize, this.images.Grass));
            break;
        }
        const cell = new Cell(x, y, this.cellSize, this.cellSize,true);
        sprites.push(cell);
      }
    }
  }

  update() {}

  draw(ctx) {}
}
