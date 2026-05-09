class GameLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.utils = utils;
  }

  initialize() {
    this.game.currentGameLevel = this;

    if (!this.game.panel) {
      this.game.panel = new Panel(this.game, this.utils);
    }

    this.changeMapForPlayerLevel(this.game.panel.playerState.level);
  }

  getMapForPlayerLevel(level) {
    if (level >= 4) return this.utils.MAP.map_4 || this.utils.MAP.map_1;
    if (level === 3) return this.utils.MAP.map_3 || this.utils.MAP.map_1;
    if (level === 2) return this.utils.MAP.map_2 || this.utils.MAP.map_1;
    return this.utils.MAP.map_1;
  }

  clearBattlefieldSprites() {
    this.game.arrayOfSprites = this.game.arrayOfSprites.filter((sprite) => {
      if (sprite === this.game.panel) return true;
      if (sprite.isMapTile) return false;
      if (sprite.isEnemy || sprite.isProjectile || sprite.isPlacedObject) return false;
      return true;
    });
  }

  buildMap(mapArray) {
    new Grid(40, this.game.arrayOfSprites, this.utils, mapArray);
  }

  changeMapForPlayerLevel(level) {
    const map = this.getMapForPlayerLevel(level);
    this.clearBattlefieldSprites();
    this.buildMap(map);

    this.game.arrayOfSprites = this.game.arrayOfSprites.filter((sprite) => sprite !== this.game.panel);
    this.game.addSprite(this.game.panel);
  }
}
