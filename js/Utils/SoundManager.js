class SoundManager extends Sprite {
  constructor(sound) {
    super();
    this.Sound = sound ? new Audio(sound) : null;
    if (this.Sound) this.Sound.volume = 0.7;
    this.playStory();
  }
  playStory() {
    if (!this.Sound) return;
    this.Sound.play().catch(() => {});
  }
  stopStory() {
    if (!this.Sound) return;
    this.Sound.pause();
    this.Sound.currentTime = 0;
  }

  static loadSound(id, src, options = {}) {
    if (!id || !src) return null;
    if (!SoundManager.sounds[id]) {
      const audio = new Audio(src);
      audio.loop = !!options.loop;
      audio.preload = "auto";
      if (typeof options.volume === "number") {
        audio.volume = Math.max(0, Math.min(1, options.volume));
      }
      SoundManager.sounds[id] = audio;
    }
    return SoundManager.sounds[id];
  }

  static playLoop(id, volume) {
    const audio = SoundManager.sounds[id];
    if (!audio) return;
    audio.loop = true;
    if (typeof volume === "number") this.setVolume(id, volume);
    if (!audio.paused) return;
    audio.play().catch(() => {});
  }

  static stop(id) {
    const audio = SoundManager.sounds[id];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }

  static stopAll() {
    const ids = Object.keys(SoundManager.sounds);
    for (let i = 0; i < ids.length; i++) this.stop(ids[i]);
  }

  static setVolume(id, volume) {
    const audio = SoundManager.sounds[id];
    if (!audio) return;
    audio.volume = Math.max(0, Math.min(1, volume));
  }

  static isPlaying(id) {
    const audio = SoundManager.sounds[id];
    return !!(audio && !audio.paused);
  }

  update(sprites, keys) {}
  draw(ctx) {}
}

SoundManager.sounds = {};
