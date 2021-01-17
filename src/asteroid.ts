import * as THREE from '../node_modules/three/src/Three';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader';

function random(min: number, max: number){
    return Math.random() * (max-min) + min;
}


export class AsteroidGroup extends THREE.Group {
    constructor() {
        super();
    }

    moveTowardsCamera(camera: THREE.Camera) {
        this.children.forEach((child: Asteroid) => {
            child.position.set(
                child.position.x += (camera.position.x - child.position.x) * child.speed,
                child.position.y += (camera.position.y - child.position.y) * child.speed,
                child.position.z += (camera.position.z - child.position.z) * child.speed  
            );
            child.rotation.set(
                child.rotation.x += child.rotationIncrement,
                child.rotation.y += child.rotationIncrement,
                child.rotation.z += child.rotationIncrement
            );
        });
    }

    createAsteroid() {
        let asteroid = new Asteroid();
        asteroid.setRandomPosition();

        this.add(asteroid);
    }
}

export class Asteroid extends THREE.Object3D {
    public rotationIncrement: number;
    public speed: number;

    constructor() {
        super();
        this.rotationIncrement = 0.01;
        this.speed = 0.001;

        let loader = new GLTFLoader();

        loader.load('assets/models/asteroid.glb', object => {
            let asteroid = object.scene.children[0];
            this.add(asteroid.clone());           
            this.setRandomPosition(); 
        }); 
    }

    setRandomPosition() {
        this.position.set(
            random(-3,3), // x
            random(0, 3), // y
            random(-4,-2) // z
        );
        
        this.rotation.set(random(0, Math.PI), random(0, Math.PI), random(0, Math.PI));
    }
}