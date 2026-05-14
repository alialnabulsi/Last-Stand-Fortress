class HelpLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
    this.helpLines = utils.LevelsTexts.HelpLevel.helpLines;
    this.screenConfig = utils.LevelScreens.HelpLevel;
  }

  initialize() {
    this.game.addSprite(new Background(this.MenuBackgroundImage));
    const titleConfig = this.screenConfig.title;
    const linesConfig = this.screenConfig.lines;
    const backButtonConfig = this.screenConfig.backButton;

    this.game.addSprite(
      new Text(titleConfig.x, titleConfig.y, titleConfig.text, titleConfig.style),
    );

    for (let i = 0; i < this.helpLines.length; i++) {
      this.game.addSprite(
        new Text(linesConfig.x, linesConfig.startY + i * linesConfig.gapY, this.helpLines[i], linesConfig.style),
      );
    }

    this.game.addSprite(
      new Button(backButtonConfig.x, backButtonConfig.y, backButtonConfig.width, backButtonConfig.height, this.backButtonTitle, () => {
        this.game.changeLevel(0);
      }),
    );
  }
}
