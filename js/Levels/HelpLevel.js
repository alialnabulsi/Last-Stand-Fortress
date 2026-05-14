class HelpLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
    this.helpLines = utils.LevelsTexts.HelpLevel.helpLines;
    this.screenConfig = utils.LevelScreens.HelpLevel;
    this.soundConfig = utils.SOUNDS.HELP;
    this.sound = null;
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
        this.changeLevel(0);
      }),
    );

    this.setupSound();
  }

  setupSound() {
    if (this.sound) this.sound.stopAll();

    this.sound = new Sound();
    this.game.addSprite(this.sound);

    this.sound.addSoundsFromConfig(this.soundConfig);
    if (this.soundConfig.MUSIC) this.sound.play(this.soundConfig.MUSIC.id);
  }

  changeLevel(index) {
    if (this.sound) this.sound.stopAll();
    this.game.changeLevel(index);
  }
}
