import * as THREE from '../node_modules/three/src/Three';
import { Asteroid } from './asteroid';

export class AsteroidGroup extends THREE.Group {
    public allowedDistance: number;
    public rotationIncrement: number;
    public speed: number;
    public speedIncrement: number;

    constructor() {
        super();

        this.allowedDistance = 0.5;
        this.rotationIncrement = 0.01;
        this.speed = 0.001;
        this.speedIncrement = 0.00005;
    }

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

    private createAsteroid() {
        let asteroid = new Asteroid();
        asteroid.setRandomPosition();

        this.add(asteroid);
    }

    private checkIfAsteroidToClose(camera: THREE.Camera) {
        this.children.forEach((child: Asteroid) => {
            let distance = child.position.distanceTo(camera.position);

            if(distance < this.allowedDistance) {
                this.remove(child);
            }
        });
    }

    public update(camera: THREE.Camera) {
        this.moveTowardsCamera(camera);
        this.checkIfAsteroidToClose(camera);
    }

    public updateEachSecond() {
        this.createAsteroid();
        this.speed += this.speedIncrement;
    }
}
