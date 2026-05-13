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

    this.game.addSprite(
      new Text(800, 110, "Story", {
        font: "bold 58px Georgia",
        color: "#e8d174",
        shadow: true,
        stroke: true,
      }),
    );

    for (let i = 0; i < this.shortStoryIntro.length; i++) {
      const isLastLine = i === this.shortStoryIntro.length - 1;

      this.game.addSprite(
        new Text(800, 235 + i * 85, this.shortStoryIntro[i], {
          font: isLastLine ? "bold 36px Georgia" : "30px Georgia",
          color: isLastLine ? "#ffd27d" : "#f2f2f2",
          shadow: true,
          stroke: true,
          maxWidth: 1380,
        }),
      );
    }

    this.game.addSprite(
      new Button(100, 800, 300, 56, this.backButtonTitle, () => {
        this.game.changeLevel(0);
      }),
    );
  }
}
