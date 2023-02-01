import * as THREE from 'three';
import gsap from 'gsap';

export default class MouseTracking {
	constructor(webgl) {
		this.webgl = webgl;

    this.scene = this.webgl.scene;
    this.camera = this.webgl.camera;
    this.render = this.webgl.render;
    this.planes = this.webgl.planes;

    this.setInstances();
    // this.update();

    window.addEventListener('mousemove', (event) => {
      this.onMouseMove(event);
    });
  }

  setInstances() {
    this.raycaster = new THREE.Raycaster();
    this.coordinates = new THREE.Vector2();
  }

  onMouseMove(event) {
    this.coordinates.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.coordinates.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  update() {
    this.raycaster.setFromCamera(this.coordinates, this.camera.instance);
    this.intersects = this.raycaster.intersectObjects(this.scene.children);
  }
}