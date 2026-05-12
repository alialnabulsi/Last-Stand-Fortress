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
    this.initializeSounds();

    this.game.addSprite(new Background(this.MenuBackgroundImage));
    this.game.addSprite(
      new Text(800, 350, this.title, {
        color: "#e8d174",
        font: "bold 64px Georgia",
        shadow: false,
        stroke: false,
      }),
    );
    this.game.addSprite(
      new Button(650, 425, 300, 50, this.startButtonTitle, () => {
        const entryMusic = Sound.find(this.game.arrayOfSprites, "entryMusic");
        if (entryMusic) entryMusic.stop();
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
  initializeSounds() {
    const sounds = this.utils.Sounds;

    for (const soundKey in sounds) {
      const soundData = sounds[soundKey];

      if (Array.isArray(soundData)) {
        for (let i = 0; i < soundData.length; i++) {
          this.addSoundSprite(soundData[i]);
        }
      } else {
        this.addSoundSprite(soundData);
      }
    }
  }

  addSoundSprite(soundData) {
    if (!soundData) return;

    if (Sound.find(this.game.arrayOfSprites, soundData.id)) {
      return;
    }

    this.game.addSprite(
      new Sound(
        soundData.id,
        soundData.title,
        soundData.src,
        soundData.volume,
        soundData.loop,
        soundData.autoplay,
      ),
    );
  }
  getSoundVolume(soundKey) {
    if (soundKey === "entryMusic") return 0.25;
    if (soundKey === "villageTracks") return 0.18;
    if (soundKey === "planningMusic") return 0.25;
    if (soundKey === "combatMusic") return 0.28;
    if (soundKey === "storySound") return 0.35;

    return 0.2;
  }

  getSoundLoop(soundKey) {
    if (soundKey === "storySound") return false;

    return true;
  }
}
