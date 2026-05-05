class StoryLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
    this.shortStoryIntro = utils.LevelsTexts.StoryLevel.shortStoryIntro;
    this.storySound = utils.Sounds.storySound;
  }

  initialize() {
    this.game.addSprite(new Background(this.MenuBackgroundImage));

    this.game.addSprite(new SoundManager(this.storySound));
    for (let i = 0; i < this.shortStoryIntro.length; i++) {
      const isLastLine = i === this.shortStoryIntro.length - 1;

      this.game.addSprite(
        new Text(800, 160 + i * 105, this.shortStoryIntro[i], {
          font: isLastLine ? "bold 32px Georgia" : "26px Georgia",
          color: isLastLine ? "#ffd27d" : "#f2f2f2",
          shadow: true,
          stroke: true,
        }),
      );
    }

    this.game.addSprite(
      new Button(100, 800, 300, 50, this.backButtonTitle, () => {
        let soundManager = this.game.arrayOfSprites.find(
          (sprite) => sprite instanceof SoundManager,
        );
        soundManager.stopStory();
        this.game.changeLevel(0);
      }),
    );
  }
}
