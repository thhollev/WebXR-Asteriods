import * as THREE from '../node_modules/three/src/Three';

class App {
    private scene: THREE.Scene
        private camera: THREE.Camera
        private renderer: THREE.WebGLRenderer
        
        constructor() {
            // Scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87ceeb);


            // Camera
            this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
            this.camera.position.z = 17;
            this.camera.position.y = 10;


            // Renderer
            this.renderer = new THREE.WebGLRenderer({antialias: true});
            this.renderer.setSize( window.innerWidth, window.innerHeight);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.body.appendChild( this.renderer.domElement );


            // AmbientLight
            let ambient = new THREE.AmbientLight();
            this.scene.add(ambient);
            

            // DirectionalLight
            let light = new THREE.DirectionalLight( 0xffffff, 0.6 );
            light.position.set(100, 100, 100);
            light.castShadow = true;
            light.shadow.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.5, 1000);
            this.scene.add(light);

            
            // OnResize
            window.addEventListener( 'resize', this.onResize.bind(this), false);

            // setAnimationLoop
            this.renderer.setAnimationLoop( this.update.bind(this) );
        }

        private update() {
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