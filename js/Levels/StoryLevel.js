class StoryLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
    this.shortStoryIntro = utils.LevelsTexts.StoryLevel.shortStoryIntro;
    
  }

  initialize() {
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
        this.game.changeLevel(0);
      }),
    );
        console.log("StoryLevel",this.game.arrayOfSprites);

  }
}
