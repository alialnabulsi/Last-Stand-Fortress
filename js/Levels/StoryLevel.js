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
    const entryMusic = Sound.find(this.game.arrayOfSprites, "entryMusic");
    const planningMusic = Sound.find(this.game.arrayOfSprites, "planningMusic");
    const combatMusic = Sound.find(this.game.arrayOfSprites, "combatMusic");
    const storySound = Sound.find(this.game.arrayOfSprites, "storySound");
    const villageTracks = Sound.findAll(this.game.arrayOfSprites).filter(
      (sound) => sound && sound.id && sound.id.startsWith("villageMusic"),
    );

    if (entryMusic) entryMusic.stop();
    if (planningMusic) planningMusic.stop();
    if (combatMusic) combatMusic.stop();
    for (const villageTrack of villageTracks) villageTrack.stop();
    if (storySound) storySound.play();
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
        const storySound = Sound.find(this.game.arrayOfSprites, "storySound");
        if (storySound) storySound.stop();
        this.game.changeLevel(0);
      }),
    );
  }
}
