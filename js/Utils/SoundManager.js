class SoundManager extends Sprite {
  constructor(sound) {
    super();
    this.Sound = new Audio(sound);
    this.Sound.volume = 0.7;
    this.ambientSounds = {};
    this.playStory();
  }
  playStory() { this.Sound.play(); }
  stopStory() { this.Sound.pause(); this.Sound.currentTime = 0; }

  playAmbientLoop(key, src, volume = 0.35) {
    if (!src || this.ambientSounds[key]) return this.ambientSounds[key] || null;
    const loop = new Audio(src);
    loop.loop = true;
    loop.volume = volume;
    loop.play();
    this.ambientSounds[key] = loop;
    return loop;
  }

  stopAmbientLoop(key) {
    const loop = this.ambientSounds[key];
    if (!loop) return;
    loop.pause();
    loop.currentTime = 0;
    delete this.ambientSounds[key];
  }

  update(sprites, keys) {}
  draw(ctx) {}
}
