/**
 * @author Thomas Hollevoet
 */

import { CubeTextureLoader, CubeTexture } from 'three';

export class Sky extends CubeTextureLoader{
    constructor() {
        super();
    }

    public loadSky(): CubeTexture {
        let urls = new Array(6).fill('assets/img/sky.jpg');        
        return this.load(urls);
    }
}
