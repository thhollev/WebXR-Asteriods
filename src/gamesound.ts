/**
 * @author Thomas Hollevoet
 */

import { Howl, Howler } from 'howler';


export class GameSound {
    private fireAudio: Howl
    private explosionAudio: Howl
    private lostAudio: Howl
    private backgroundAudio: Howl

    constructor() {
        this.lostAudio = new Howl({
            src: ['assets/sound/lost.wav'],
            volume: 0.5
        });

        this.fireAudio = new Howl({
            src: ['assets/sound/fire.wav'],
            volume: 0.5
        });

        this.explosionAudio = new Howl({
            src: ['assets/sound/explosion.wav'],
            volume: 0.5
        });     
        
        this.backgroundAudio = new Howl({
            src: ['assets/sound/background.mp3'],
            volume: 0.3,
            loop: true,
            autoplay: true
        });
    }

    public lost(): void {
        this.lostAudio.play();
    }

    public fire(): void {
        this.fireAudio.play();
    }

    public explosion(): void {
        this.explosionAudio.play();
    }
}