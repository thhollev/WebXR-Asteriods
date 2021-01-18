/**
 * @author Thomas Hollevoet
 */

import * as THREE from '../node_modules/three/src/Three';

export class Earth extends THREE.Mesh {
    public rotationSpeed: number;
    
    constructor() {
        let geometry = new THREE.SphereGeometry(1, 32, 32);
        let material = new THREE.MeshPhongMaterial();

        material.map = new THREE.TextureLoader().load('assets/img/earth.jpg');
        
        material.bumpMap = new THREE.TextureLoader().load('assets/img/earthBump.jpg');
        material.bumpScale = 0.05;

        material.specularMap = new THREE.TextureLoader().load('assets/img/earthSpec.jpg');
        material.specular  = new THREE.Color('grey')

        super(geometry, material);

        this.position.y = 1.6;
        this.position.z = 3;
        this.rotationSpeed = 0.002;
    }

    public update() {
        this.rotation.y += this.rotationSpeed;
    }
}