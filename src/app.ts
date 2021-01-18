/**
 * @author Thomas Hollevoet
 */

import * as THREE from '../node_modules/three/src/Three';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module';
import { PointerLockControls } from '../node_modules/three/examples/jsm/controls/PointerLockControls';
import { VRButton } from '../node_modules/three/examples/jsm/webxr/VRButton';
import { GameState } from './gamestate';
import { Sky } from './sky';
import { Earth } from './earth';    
import { AsteroidGroup } from './asteroidgroup';
import { GameSound } from './gamesound';
  

class App {
    private scene: THREE.Scene
        private camera: THREE.Camera
        private renderer: THREE.WebGLRenderer
        private stats: Stats
        private controls: PointerLockControls
        private clock: THREE.Clock
        private raycaster: THREE.Raycaster
        private workingMatrix: THREE.Matrix4
        private workingVector: THREE.Vector3
        private prevTime: number

        public gameState: GameState
        public score: number
        public lifesLost: number
        public gameOver: number
        public earth: Earth
        public asteroidGroup: AsteroidGroup
        public gameSound: GameSound

        
        constructor() {
            // Start loading the game
            this.gameState = GameState.LOADING

            // Scene
            this.scene = new THREE.Scene();

            // Camera
            this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
            this.camera.position.set( 0, 1.6, 0 );

            // Renderer
            this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
            this.renderer.setSize( window.innerWidth, window.innerHeight);
            this.renderer.outputEncoding = THREE.sRGBEncoding;
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.body.appendChild( this.renderer.domElement );

            // HemisphereLight
            let hemisphereLight = new THREE.HemisphereLight(0x606060, 0x404040);
            this.scene.add(hemisphereLight);

            // Clock
            this.clock = new THREE.Clock();
            this.prevTime = 0;

            // Controls           
            this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
            window.addEventListener('click', () => {
                this.controls.lock();
            });

            // Statistics
            this.stats = Stats();
            document.body.appendChild( this.stats.dom );

            // Working area
            this.raycaster = new THREE.Raycaster();
            this.workingMatrix = new THREE.Matrix4();
            this.workingVector = new THREE.Vector3();

            // Initial game values
            this.gameOver = 20;
            this.lifesLost = 0;
            this.score = 0;

            // Sounds
            this.gameSound = new GameSound();

            // Initialize scene
            this.initScene();

            // Setup WebXR
            this.setupXR();

            // OnResize
            window.addEventListener('resize', this.onResize.bind(this), false);

            // setAnimationLoop
            this.renderer.setAnimationLoop(this.update.bind(this));

            // Game ready to play
            this.gameState = GameState.READY
            this.gameState = GameState.PLAYING
        }

        private initScene() {
            // Create background stars
            this.scene.background = new Sky().loadSky();

            // Create an Earth
            this.earth = new Earth();
            this.scene.add(this.earth);

            // Asteroid Group
            this.asteroidGroup = new AsteroidGroup(this);
            this.scene.add(this.asteroidGroup);
        }

        private setupXR() {
            // Make this app XR
            this.renderer.xr.enabled = true;
        
            // Create Button to enter VR
            let vrButton = VRButton.createButton(this.renderer);
            document.body.appendChild(vrButton);

            let controller = this.renderer.xr.getController(0);

            this.renderer.xr.isPresenting
        }

        private handleCameraMovement() {
            let xr = this.renderer.xr.getCamera(this.camera);
            this.workingMatrix.identity().extractRotation( xr.matrixWorld );
            this.raycaster.ray.origin.setFromMatrixPosition( xr.matrixWorld );
            this.raycaster.ray.direction.set( 0, 0, -1).applyMatrix4( this.workingMatrix );

            let intersects = this.raycaster.intersectObjects(this.asteroidGroup.children, true);
            
            intersects.forEach(i => {
                this.gameSound.fire();
                this.score++;
                let asteroid = i.object.parent.parent.parent.parent.parent.parent;
                this.asteroidGroup.remove(asteroid);
            });    
        }

        private update() {
            this.stats.update();
            // Rotate the earth
            this.earth.update();
           
            if(this.renderer.xr.getSession() && this.gameState !== GameState.ENDED) {

                if(this.lifesLost >= this.gameOver) {
                    this.gameState = GameState.ENDED;
                }

                let xr = this.renderer.xr.getCamera(this.camera); 
                let delta = this.clock.getElapsedTime() - this.prevTime;

                if(delta > 1) {
                    this.prevTime = this.clock.getElapsedTime();
                    this.asteroidGroup.updateEachSecond();
                }
                
                this.handleCameraMovement();
                this.asteroidGroup.update(xr);
            }

            this.renderer.render(this.scene, this.camera);
        }

        private onResize() {
            //this.camera.aspect = window.innerWidth / window.innerHeight;
            //this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );  
        }
    }

document.addEventListener('DOMContentLoaded', (event) => {
	new App();
});

export { App };
