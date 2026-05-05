class GameLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.utils = utils;
  }

  initialize() {
    this.game.addSprite(new Grid(40,this.game.arrayOfSprites,this.utils));
  }
}
