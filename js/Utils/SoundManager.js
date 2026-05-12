class Sound extends Sprite {
  constructor(id, title, src, volume, loop, autoplay) {
    super();

    this.id = id;
    this.title = title;
    this.src = src;
    this.volume = volume;
    this.loop = loop;
    this.autoplay = autoplay;

    this.audio = new Audio(this.src);
    this.audio.volume = this.volume;
    this.audio.loop = this.loop;

    this.isPlaying = false;
    this.isPaused = false;
    this.isMuted = false;
    this.error = false;
  }

  update() {
    if (this.autoplay && !this.isPlaying && !this.error) {
      this.play();
      this.autoplay = false;
    }

    if (!this.loop && this.audio.ended) {
      this.isPlaying = false;
      this.isPaused = false;
    }

    return false;
  }

  draw(ctx) {
    // Sound sprite has no visual drawing.
  }

  play(restart = false) {
    if (this.error) return;

    if (this.isPlaying && !restart) {
      return;
    }

    if (restart) {
      this.audio.currentTime = 0;
    }

    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.audio.loop = this.loop;

    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.isPaused = false;
      })
      .catch(() => {
        this.isPlaying = false;
      });
  }

  pause() {
    if (this.error) return;

    this.audio.pause();

    this.isPlaying = false;
    this.isPaused = true;
  }

  stop() {
    if (this.error) return;

    this.audio.pause();
    this.audio.currentTime = 0;

    this.isPlaying = false;
    this.isPaused = false;
  }

  restart() {
    this.play(true);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));

    if (!this.isMuted) {
      this.audio.volume = this.volume;
    }
  }

  setLoop(loop) {
    this.loop = loop;
    this.audio.loop = this.loop;
  }

  mute() {
    this.isMuted = true;
    this.audio.volume = 0;
  }

  unmute() {
    this.isMuted = false;
    this.audio.volume = this.volume;
  }

  is(id) {
    return this.id === id;
  }

  static find(arrayOfSprites, id) {
    return arrayOfSprites.find((sprite) => {
      return sprite instanceof Sound && sprite.id === id;
    });
  }

  static findByTitle(arrayOfSprites, title) {
    return arrayOfSprites.find((sprite) => {
      return sprite instanceof Sound && sprite.title === title;
    });
  }

  static findAll(arrayOfSprites) {
    return arrayOfSprites.filter((sprite) => {
      return sprite instanceof Sound;
    });
  }

  static stopAll(arrayOfSprites) {
    const sounds = Sound.findAll(arrayOfSprites);

    for (const sound of sounds) {
      sound.stop();
    }
  }

  static pauseAll(arrayOfSprites) {
    const sounds = Sound.findAll(arrayOfSprites);

    for (const sound of sounds) {
      sound.pause();
    }
  }
}
