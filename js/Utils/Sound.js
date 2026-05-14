class Sound extends Sprite {
  constructor() {
    super();
    this.audios = [];
  }

  addSound(src, volume = 1, loop = false) {
    if (!src || this.getSound(src)) return this.getSound(src) || null;

    const audio = new Audio("sounds/" + src + ".mp3");
    audio.volume = volume;
    audio.loop = !!loop;
    audio.id = src;
    this.audios.push(audio);
    return audio;
  }

  addSoundsFromConfig(config) {
    if (!config) return;

    if (Array.isArray(config)) {
      for (const item of config) this.addSoundsFromConfig(item);
      return;
    }

    if (config.id) {
      this.addSound(config.id, config.volume, config.loop);
      return;
    }

    if (typeof config === "object") {
      for (const key in config) this.addSoundsFromConfig(config[key]);
    }
  }

  getSound(src) {
    return this.audios.find((audio) => audio && audio.id === src) || null;
  }

  play(src) {
    const audio = this.getSound(src);
    if (!audio) return false;

    const playResult = audio.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(() => {});
    }
    return true;
  }

  pause(src) {
    const audio = this.getSound(src);
    if (!audio) return false;

    audio.pause();
    return true;
  }

  stop(src) {
    const audio = this.getSound(src);
    if (!audio) return false;

    audio.pause();
    audio.currentTime = 0;
    return true;
  }

  loop(src) {
    const audio = this.getSound(src);
    if (!audio) return false;

    audio.loop = true;
    return this.play(src);
  }

  playAll() {
    for (const audio of this.audios) this.play(audio.id);
  }

  pauseAll() {
    for (const audio of this.audios) audio.pause();
  }

  stopAll() {
    for (const audio of this.audios) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(src, volume) {
    const audio = this.getSound(src);
    if (!audio) return false;

    audio.volume = volume;
    return true;
  }

  update() {}

  draw() {}
}
