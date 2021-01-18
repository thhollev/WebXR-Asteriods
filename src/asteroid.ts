/**
 * @author Thomas Hollevoet
 */

import * as THREE from '../node_modules/three/src/Three';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader';
import { Util } from './util';

export class Asteroid extends THREE.Object3D {
   
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
