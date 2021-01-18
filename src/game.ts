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

    // Set all values back to initial state
    public restart(): void {
        this.lifesLost = 0;
        this.score = 0;
        this.gameView.asteroidGroup.speed = this.gameView.asteroidGroup.speedInitial;
        this.gameState = GameState.PLAYING;
    }

    // An Asteroid is hit
    public playerScored(): void {
        this.gameSound.fire();
        this.score++;
    }

    // An Asteroid was to close
    public playerLostALive(): void {
        this.gameSound.explosion();
        this.lifesLost++;
    }

    // Check if the player is lost
    public checkIfPlayerLost(): void {
        if(this.lifesLost >= this.gameOver) {
            this.playerLost();
        }
    }

    // Set the game to ended
    public playerLost(): void {
        this.gameState = GameState.ENDED;
        this.gameSound.lost();
        this.gameView.asteroidGroup.clear();
    }
}
