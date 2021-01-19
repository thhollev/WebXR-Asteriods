---
marp: true
theme: gaia
size: 16:9
template: gaia
---

# WebXR Project
### Intro to VR with ThreeJS

Creating the Asteroid Game

Thomas Hollevoet
wednesday 20 january 2021

---
# Documentatie

https://webxr.hollevoet.org/asteroids/documentatie/

---
# Udemy

- Hands on ThreeJS 3D web visualisations
- Three.js and TypeScript
- Learn to create WebXR, VR and AR, experiences using Three.JS
- Learn A-Frame And Get Ready For WebVR
 
 ---
 # AR Leergroep

 - Remote debugging
 - HoloLens

 ---
 # VR Project

 ### Initieel

 - open wereld -> niet performant op mobiel
 - gedetailleerde meshes -> niet performant op mobiel

### Bril

 - Samsung Gear VR

 ---
 # Samsung Gear VR


 <img src="https://webxr.hollevoet.org/asteroids/documentatie/img/gearvr.png" /> 

---
# Samsung Gear VR

- LineageOS geen Gear VR Services

- https://jsyang.ca/hacks/gear-vr-rev-eng/

---
# Wat nu?

- mogelijkheden 3DOF

- geen controller

---
# Asteroids

<hr>
<blockquote>
    Je bent de uitverkorene op deze aarde, jouw taak is om ons te redden! Met jouw laserogen moet je de kometen die naar de aarde komen vernietigen! Kan jij ons redden? Word jij onze nieuwe superheld? Red ons nu!
</blockquote>
<hr>

---
# Demo

---
# Stack

- TypeScript

- Webpack

- ThreeJS

- Growler

---
# Game

```ts
export class Game {
    private gameView: GameView
    public gameState: GameState
    public score: number
    public lifesLost: number
    public gameOver: number
    public gameSound: GameSound

    constructor() {}
    public restart(): void {}
    public playerScored(): void {}
    public playerLostALive(): void {}
    public checkIfPlayerLost(): void {}
    public playerLost(): void {}
    public buttonPressed(): void {}
}
```

---
# GameState

```ts
export enum GameState {
   LOADING,
   READY,
   PLAYING,
   ENDED    
}
```

---
# GameSound

```ts
export class GameSound {
    private fireAudio: Howl; explosionAudio: Howl; lostAudio: Howl; backgroundAudio: Howl

    constructor() {
        this.lostAudio = new Howl({
            src: ['assets/sound/lost.wav'], volume: 0.5
        });
        ...
        this.backgroundAudio = new Howl({
            src: ['assets/sound/background.mp3'], volume: 0.3, loop: true, autoplay: true
        });
    }

    public lost(): void { this.lostAudio.play(); }
    public fire(): void {this.fireAudio.play(); }
    public explosion(): void { this.explosionAudio.play();
}
```
---
# Sky
```ts
export class Sky extends CubeTextureLoader{
    constructor() { super(); }

    public loadSky(): CubeTexture {
        let urls = new Array(6).fill('assets/img/sky.jpg');        
        return this.load(urls);
    }
}

```
---
# Earth

```ts

export class Earth extends Mesh {
    public rotationSpeed: number;
    
    constructor() {
        let geometry = new SphereGeometry(1, 32, 32);
        let material = new MeshPhongMaterial();
        material.map = new TextureLoader().load('assets/img/earth.jpg');
        material.bumpMap = new TextureLoader().load('assets/img/earthBump.jpg');
        material.bumpScale = 0.05;
        material.specularMap = new TextureLoader().load('assets/img/earthSpec.jpg');
        material.specular  = new Color('grey')
        super(geometry, material);
        this.position.y = 1.6;
        this.position.z = 3;
        this.rotationSpeed = 0.002;
    }

    public update(): void {
        this.rotation.y += this.rotationSpeed;
    }
}

```

---
# Asteroid

```ts
export class Asteroid extends Object3D {
    constructor() {
        super();
        let loader = new GLTFLoader();
        loader.load('assets/models/asteroid.glb', object => {
            let asteroid = object.scene.children[0];
            this.add(asteroid.clone());           
            this.setRandomPosition(); 
        }); 
    }

    public setRandomPosition() {
        this.position.set(
            Util.random(-3,3), // x
            Util.random(0, 3), // y
            Util.random(-4,-2) // z
        );
        this.rotation.set(Util.random(0, Math.PI), Util.random(0, Math.PI), Util.random(0, Math.PI));
    }
}
```

---

# Util

```ts
export class Util {
    public static random(min: number, max: number): number{
        return Math.random() * (max-min) + min;
    }
}
```

---

# AsteroidGroup

```ts
export class AsteroidGroup extends Group {
    private gameView: GameView
    public allowedDistance: number;
    public rotationIncrement: number;
    public speed: number;
    public speedInitial: number;
    public speedIncrement: number;

    constructor(gameView: GameView) {
        super();
        this.gameView = gameView;
        this.allowedDistance = 0.5;
        this.rotationIncrement = 0.01;
        this.speed = 0.001;
        this.speedInitial = 0.001;
        this.speedIncrement = 0.0005;
    }
}

```

---

# moveTowardsCamera

```ts
private moveTowardsCamera(camera: THREE.Camera) {
        this.children.forEach((child: Asteroid) => {
            child.position.set(
                child.position.x += (camera.position.x - child.position.x) * this.speed,
                child.position.y += (camera.position.y - child.position.y) * this.speed,
                child.position.z += (camera.position.z - child.position.z) * this.speed  
            );
            child.rotation.set(
                child.rotation.x += this.rotationIncrement,
                child.rotation.y += this.rotationIncrement,
                child.rotation.z += this.rotationIncrement
            );
        });
    }
```

---

# createAsteroid

```ts
private createAsteroid() {
        let asteroid = new Asteroid();
        asteroid.setRandomPosition();
        this.add(asteroid);
    }
```

---

# checkIfAsteroidToClose

```ts
private checkIfAsteroidToClose(camera: THREE.Camera) {
    this.children.forEach((child: Asteroid) => {
        let distance = child.position.distanceTo(camera.position);

        if(distance < this.allowedDistance) {
            this.gameView.game.playerLostALive();
            this.remove(child);
        }
    });
}
```

---

# GameView

```ts
export class GameView {
    ...
    public game: Game
    public earth: Earth
    public asteroidGroup: AsteroidGroup

    constructor(game: Game) {
        this.game = game
        this.scene = new Scene();
        this.camera = new PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.set( 0, 1.6, 0 );
        this.renderer = new WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize( window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
        document.body.appendChild( this.renderer.domElement );
        let hemisphereLight = new HemisphereLight(0x606060, 0x404040);
        this.scene.add(hemisphereLight);
        this.clock = new Clock();
        this.prevTime = 0;
        this.stats = Stats();
        document.body.appendChild( this.stats.dom );
        this.raycaster = new Raycaster();
        this.workingMatrix = new Matrix4();
        this.workingVector = new Vector3();
        ...
    }
}

```

---

# InitScene

```ts
private initScene() {
    this.scene.background = new Sky().loadSky();

    this.earth = new Earth();
    this.scene.add(this.earth);

    this.asteroidGroup = new AsteroidGroup(this);
    this.scene.add(this.asteroidGroup);
}

```

---

# setupXR

```ts
private setupXR() {
        this.renderer.xr.enabled = true;
    
        let vrButton = VRButton.createButton(this.renderer);
        document.body.appendChild(vrButton);

        let controller = this.renderer.xr.getController(0);
        controller.addEventListener('selectstart', () => {
            this.game.buttonPressed();
        });             
    }
```

 ---

# handleCameraMovement

```ts
private handleCameraMovement() {
    let xr = this.renderer.xr.getCamera(this.camera);
    this.workingMatrix.identity().extractRotation( xr.matrixWorld );
    this.raycaster.ray.origin.setFromMatrixPosition( xr.matrixWorld );
    this.raycaster.ray.direction.set( 0, 0, -1).applyMatrix4( this.workingMatrix );

    let intersects = this.raycaster.intersectObjects(this.asteroidGroup.children, true);
    
    intersects.forEach(i => {
        this.game.playerScored();
        let asteroid = i.object.parent.parent.parent.parent.parent.parent;
        this.asteroidGroup.remove(asteroid);
    });    
}

```

 ---

# Gameloop

```ts
private update() {
    this.stats.update();
    this.earth.update();
    
    if(this.renderer.xr.getSession() && this.game.gameState === GameState.PLAYING) {
        this.game.checkIfPlayerLost();

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

```
---

# Tutorial

https://webxr.hollevoet.org/asteroids/tutorial/

---

# Improvements

 - feedback score, lifesLost
 - kometen ontploffen
 - aarde wordt aangetast
 - menu
 - FPS Mode
 - PWA
 - ...
 ---

# Controls

```ts
this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
window.addEventListener('click', () => {
    this.controls.lock();
});
```
---

# PWA

- Standalone

- niet afhankelijk van afhankelijke ecosystemen

---

# Takeaways

- WebXR niet alleen huidige maar ook toekomstige

- HoloLens

- 6DOF

---
# The End, The Future is looking great!

- Live versie van het spel
https://webxr.hollevoet.org/asteroids/

- Documentatieproces
https://webxr.hollevoet.org/asteroids/documentatie/

- Tutorial
https://webxr.hollevoet.org/asteroids/tutorial/

- Presentatie
https://webxr.hollevoet.org/asteroids/presentatie/
