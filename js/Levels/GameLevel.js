class GameLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.currentMap = null;
    this.tileGrid = [];
    this.pathTiles = [];
    this.spawners = [];
    this.townHall = null;
    this.hasWater = false;
  }
  initialize() {
    this.game.currentGameLevel = this;
    let panel = this.findPanel();
    if (!panel) {
      panel = new Panel(this.game, this.utils);
      this.game.addSprite(panel);
    }
    if (!panel) return;

    this.changeMapForPlayerLevel(panel.playerState.level);
     console.log("GameLevel",this.game.arrayOfSprites);
  }

  findPanel() {
    return this.game.arrayOfSprites.find((sprite) => sprite instanceof Panel) || null;
  }
  getMapForPlayerLevel(level) {
    if (level >= 4) return this.utils.MAP.map_4 || this.utils.MAP.map_1;
    if (level === 3) return this.utils.MAP.map_3 || this.utils.MAP.map_1;
    if (level === 2) return this.utils.MAP.map_2 || this.utils.MAP.map_1;
    return this.utils.MAP.map_1;
  }
  clearBattlefieldSprites() {
    const panel = this.findPanel();
    this.game.arrayOfSprites = this.game.arrayOfSprites.filter((sprite) => {
      if (panel && sprite === panel) return true;
      if (sprite.isMapTile) return false;
      if (sprite.isEnemy || sprite.isProjectile || sprite.isPlacedObject)
        return false;
      return true;
    });
  }
  buildMap(mapArray) {
    new Grid(40, this.game.arrayOfSprites, this.utils, mapArray);
    this.currentMap = mapArray;
    this.rebuildTileDataFromMap();
    this.setupAmbientWater();
  }
  rebuildTileDataFromMap() {
    const rows = this.currentMap ? this.currentMap.length : 0;
    const cols = rows > 0 ? this.currentMap[0].length : 0;
    this.tileGrid = Array.from({ length: rows }, () => Array(cols).fill(null));
    this.pathTiles = [];
    this.spawners = [];
    this.townHall = null;
    this.hasWater = false;
    const mapTiles = this.game.arrayOfSprites.filter(
      (sprite) => sprite && sprite.isMapTile && !sprite.isCell,
    );
    for (let i = 0; i < mapTiles.length; i++) {
      const tile = mapTiles[i];
      if (typeof tile.row !== "number") tile.row = Math.floor(tile.y / 40);
      if (typeof tile.col !== "number") tile.col = Math.floor(tile.x / 40);
      if (tile instanceof Spawner) tile.game = this.game;
      if (
        this.isInsideMap(tile.row, tile.col) &&
        !this.tileGrid[tile.row][tile.col]
      )
        this.tileGrid[tile.row][tile.col] = tile;
      if (tile.isEnemyPath === true) this.pathTiles.push(tile);
      if (tile.isSpawner === true) this.spawners.push(tile);
      if (tile.isTownHall === true) this.townHall = tile;
      if (tile.tileType === "WATER") this.hasWater = true;
    }
  }
  setupAmbientWater() {
    return;
  }

  static mapHasWater(mapArray) {
    if (!Array.isArray(mapArray)) return false;
    for (let i = 0; i < mapArray.length; i++) {
      if (Array.isArray(mapArray[i]) && mapArray[i].includes(5)) return true;
    }
    return false;
  }
  isInsideMap(row, col) {
    return (
      row >= 0 &&
      col >= 0 &&
      row < this.tileGrid.length &&
      this.tileGrid[row] &&
      col < this.tileGrid[row].length
    );
  }
  getTileAt(row, col) {
    if (!this.isInsideMap(row, col)) return null;
    return this.tileGrid[row][col];
  }
  isPathTile(row, col) {
    const tile = this.getTileAt(row, col);
    return !!(tile && tile.isEnemyPath === true);
  }
  getPathNeighbors(row, col) {
    const offsets = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const out = [];
    for (const [dr, dc] of offsets) {
      const nr = row + dr;
      const nc = col + dc;
      const tile = this.getTileAt(nr, nc);
      if (tile && this.isPathTile(nr, nc)) out.push(tile);
    }
    return out;
  }
  getSpawnerTiles() {
    return this.spawners.slice();
  }
  getTownHallTile() {
    return this.townHall;
  }
  getNearestTownHallPathTile() {
    if (!this.townHall) return null;
    const targetRow = this.townHall.row;
    const targetCol = this.townHall.col;
    let best = null;
    let bestDist = Infinity;
    for (const tile of this.pathTiles) {
      const d = Math.abs(tile.row - targetRow) + Math.abs(tile.col - targetCol);
      if (d < bestDist) {
        bestDist = d;
        best = tile;
      }
    }
    return best;
  }
  getNextPathStep(row, col, previousRow, previousCol) {
    const neighbors = this.getPathNeighbors(row, col);
    if (neighbors.length === 0) return null;
    const target = this.getNearestTownHallPathTile() || this.getTownHallTile();
    if (!target) return neighbors[0];
    const filtered = neighbors.filter(
      (n) => !(n.row === previousRow && n.col === previousCol),
    );
    const candidates = filtered.length > 0 ? filtered : neighbors;
    candidates.sort(
      (a, b) =>
        Math.abs(a.row - target.row) +
        Math.abs(a.col - target.col) -
        (Math.abs(b.row - target.row) + Math.abs(b.col - target.col)),
    );
    return candidates[0] || null;
  }
  changeMapForPlayerLevel(level) {
    const map = this.getMapForPlayerLevel(level);
    const panel = this.findPanel();
    this.clearBattlefieldSprites();
    this.buildMap(map);
    if (panel) {
      this.game.arrayOfSprites = this.game.arrayOfSprites.filter(
        (sprite) => sprite !== panel,
      );
      this.game.addSprite(panel);
    }
  }
}
