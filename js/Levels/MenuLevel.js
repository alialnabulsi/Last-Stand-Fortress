class MenuLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.title = utils.LevelsTexts.MenuLevel.title;
    this.startButtonTitle = utils.LevelsTexts.MenuLevel.startButtonTitle;
    this.helpButtonTitle = utils.LevelsTexts.MenuLevel.helpButtonTitle;
    this.storyButtonTitle = utils.LevelsTexts.MenuLevel.storyButtonTitle;
    this.screenConfig = utils.LevelScreens.MenuLevel;
  }

  initialize() {
    this.game.addSprite(new Background(this.MenuBackgroundImage));
    const titleConfig = this.screenConfig.title;
    const subtitleConfig = this.screenConfig.subtitle;
    const buttonConfig = this.screenConfig.buttons;
    const soundConfig = this.screenConfig.sound;

    this.game.addSprite(
      new Text(titleConfig.x, titleConfig.y, this.title, titleConfig.style),
    );

    this.game.addSprite(
      new Text(subtitleConfig.x, subtitleConfig.y, subtitleConfig.text, subtitleConfig.style),
    );

    this.game.addSprite(
      new Button(buttonConfig.x, buttonConfig.startY, buttonConfig.width, buttonConfig.height, this.startButtonTitle, () => {
        this.game.changeLevel(3);
      }),
    );
    this.game.addSprite(
      new Button(buttonConfig.x, buttonConfig.startY + buttonConfig.gapY, buttonConfig.width, buttonConfig.height, this.helpButtonTitle, () => {
        this.game.changeLevel(1);
      }),
    );
    this.game.addSprite(
      new Button(buttonConfig.x, buttonConfig.startY + buttonConfig.gapY * 2, buttonConfig.width, buttonConfig.height, this.storyButtonTitle, () => {
        this.game.changeLevel(2);
      }),
    );

    const sound = new Sound();

    sound.addSound(soundConfig.id, soundConfig.volume);
    sound.play(soundConfig.id);
    console.log(sound);
  }
}
