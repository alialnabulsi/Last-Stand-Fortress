class HelpLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
  }

  initialize() {
    this.game.addSprite(new Background(this.MenuBackgroundImage));

    this.game.addSprite(
      new Button(100, 800, 300, 50, this.backButtonTitle, () => {
        this.game.changeLevel(0);
      }),
    );
  }
}
