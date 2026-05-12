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
     //change this when we change how the soundManager works
    if (this.game.sounds) {
      this.game.sounds.entryMusic.stop();
      this.game.sounds.villageMusic.stop();
      this.game.sounds.planningMusic.stop();
      this.game.sounds.combatMusic.stop();
      this.game.sounds.storySound.play();
    }
    this.game.addSprite(new Background(this.MenuBackgroundImage));
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
        if (this.game.sounds) this.game.sounds.storySound.stop();
        this.game.changeLevel(0);
      }),
    );
  }
}
