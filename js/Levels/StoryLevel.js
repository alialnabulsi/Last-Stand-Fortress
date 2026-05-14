class StoryLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
    this.shortStoryIntro = utils.LevelsTexts.StoryLevel.shortStoryIntro;
    this.screenConfig = utils.LevelScreens.StoryLevel;
    this.soundConfig = utils.SOUNDS.STORY;
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

    for (let i = 0; i < this.shortStoryIntro.length; i++) {
      const isLastLine = i === this.shortStoryIntro.length - 1;
      const lineStyle = {
        ...(isLastLine ? linesConfig.lastLineStyle : linesConfig.style),
        maxWidth: linesConfig.maxWidth,
      };

      this.game.addSprite(
        new Text(linesConfig.x, linesConfig.startY + i * linesConfig.gapY, this.shortStoryIntro[i], lineStyle),
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
