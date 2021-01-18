import * as THREE from '../node_modules/three/src/Three';

export class Sky {
    public sky: THREE.CubeTexture
    public scene: THREE.Scene

    constructor(scene: THREE.Scene) {
        this.scene = scene;

        let urls = new Array(6).fill('assets/img/sky.jpg');        
        let loader = new THREE.CubeTextureLoader();
       
        this.sky = loader.load(urls);

        // Add Sky as a background
        this.scene.background = this.sky;
    }
}
