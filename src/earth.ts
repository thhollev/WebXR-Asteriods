/**
 * @author Thomas Hollevoet
 */

import { Mesh, SphereGeometry, MeshPhongMaterial, TextureLoader, Color } from 'three';

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
