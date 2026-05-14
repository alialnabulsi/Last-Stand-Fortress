class Sound extends Sprite{
    constructor(){
        super();
        this.audios = [];
    }

    addSound(src,volume){
        const temp =  new Audio("sounds/" + src + ".mp3");
        temp.volume = volume;
        temp.id =src;
        this.audios.push(temp);
    }
    play(src){
        for (let i = 0; i < this.audios.length; i++){
            if(this.audios[i].id == src){
            }
        }
    }

    pause(src){

    }

    playAll(){

    }

    pauseAll(){

    }

};