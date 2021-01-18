/**
 * @author Thomas Hollevoet
 */

import * as THREE from '../node_modules/three/src/Three';

export class Sky extends THREE.CubeTextureLoader{
    constructor() {
        super();
    }

    public loadSky(): THREE.CubeTexture {
        let urls = new Array(6).fill('assets/img/sky.jpg');        
        return this.load(urls);
    }
}
