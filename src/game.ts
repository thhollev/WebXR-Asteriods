/**
 * @author Thomas Hollevoet
 */

import { GameState } from './gamestate';  
import { GameSound } from './gamesound';
import { GameView } from './gameview';


export class Game {
    private gameView: GameView

    public gameState: GameState
    public score: number
    public lifesLost: number
    public gameOver: number
    public gameSound: GameSound

    
    constructor() {
        // Start loading the game
        this.gameState = GameState.LOADING

        // Initial game values
        this.gameOver = 20;
        this.lifesLost = 0;
        this.score = 0;

        // Setup View
        this.gameView = new GameView(this);

        // Sounds
        this.gameSound = new GameSound();

        // Game ready to play
        this.gameState = GameState.READY
    }

    public restart(): void {
        this.lifesLost = 0;
        this.score = 0;
        this.gameView.asteroidGroup.speed = this.gameView.asteroidGroup.speedInitial;
        this.gameState = GameState.PLAYING;
    }
}
