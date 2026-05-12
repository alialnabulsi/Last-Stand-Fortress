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
    this.unlockHandlerAttached = false;
  }

  initialize() {
    this.initializeSounds();
    this.game.changeLevel(0);
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
        this.stopMenuAndStoryMusic();
        this.playRandomVillageTrack();
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
        this.stopMenuAndStoryMusic();
        this.game.changeLevel(2);
      }),
    );

    this.playEntryMusic();
    this.attachMenuAudioUnlock();
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

  stopMenuAndStoryMusic() {
    const entryMusic = Sound.find(this.game.arrayOfSprites, "entryMusic");
    const storySound = Sound.find(this.game.arrayOfSprites, "storySound");
    const villageTracks = Sound.findAll(this.game.arrayOfSprites).filter(
      (sound) => {
        return sound && sound.id && sound.id.startsWith("villageMusic");
      },
    );

    if (entryMusic) entryMusic.stop();
    if (storySound) storySound.stop();
    for (const track of villageTracks) track.stop();
  }

  playRandomVillageTrack() {
    const villageTracks = Sound.findAll(this.game.arrayOfSprites).filter(
      (sound) => {
        return sound && sound.id && sound.id.startsWith("villageMusic");
      },
    );

    for (const track of villageTracks) track.stop();
    if (villageTracks.length === 0) return;

    const randomIndex = Math.floor(Math.random() * villageTracks.length);
    villageTracks[randomIndex].play();
  }

  playEntryMusic() {
    const entryMusic = Sound.find(this.game.arrayOfSprites, "entryMusic");
    if (!entryMusic) return;

    entryMusic.play();
  }

  attachMenuAudioUnlock() {
    if (this.unlockHandlerAttached) return;
    this.unlockHandlerAttached = true;

    const unlock = () => {
      const entryMusic = Sound.find(this.game.arrayOfSprites, "entryMusic");
      if (entryMusic) entryMusic.play();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      this.unlockHandlerAttached = false;
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
  }

  
}
