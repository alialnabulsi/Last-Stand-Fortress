//should be transformed into a sprite
class SoundManager {
  constructor(src, options = {}) {
    this.audio = new Audio(src);
    this.audio.preload = "auto";
    this.isPlaying = false;
    this.setVolume(typeof options.volume === "number" ? options.volume : 0.7);
    this.setLoop(!!options.loop);
    this.audio.addEventListener("ended", () => {
      this.isPlaying = false;
    });
  }

  play() {
    if (!this.audio || this.isPlaying) return;
    this.isPlaying = true;
    this.audio.play().catch(() => {
      this.isPlaying = false;
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
  }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  setVolume(volume) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  setLoop(loop) {
    if (!this.audio) return;
    this.audio.loop = !!loop;
  }
}
