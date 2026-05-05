class SoundManager extends Sprite {
    constructor(sound) {
        super();
        this.Sound = new Audio(sound);
        this.Sound.volume = 0.7;
        this.playStory();
    }

    playStory(){
        this.Sound.play();
    }

    stopStory(){
        this.Sound.pause();
        this.Sound.currentTime = 0;
    }

    update(sprites, keys) {
    }

    draw(ctx) {
    }
}
