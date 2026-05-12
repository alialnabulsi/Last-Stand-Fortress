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
  }

  initialize() {
    //change this when we change how the soundManager works
    if (this.game.sounds) {
      this.game.sounds.storySound.stop();
      this.game.sounds.villageMusic.stop();
      this.game.sounds.planningMusic.stop();
      this.game.sounds.combatMusic.stop();
      this.game.sounds.entryMusic.play();
    }
    this.game.addSprite(new Background(this.MenuBackgroundImage));
    this.game.addSprite(
      new Text(800, 350, this.title, {
        color: "#e8d174",
        font:  "bold 64px Georgia",
        shadow: false,
        stroke: false,
      }),
    );
    this.game.addSprite(
      new Button(650, 425, 300, 50, this.startButtonTitle, () => {
        if (this.game.sounds) this.game.sounds.entryMusic.stop();
        this.game.changeLevel(3);
      }),
    );
    this.game.addSprite(
      new Button(650, 525, 300, 50, this.helpButtonTitle, () => {
        this.game.changeLevel(1);
      }),
    );
    this.game.addSprite(
      new Button(650, 625, 300, 50, this.storyButtonTitle, () => {
        this.game.changeLevel(2);
      }),
    );
  }
}
