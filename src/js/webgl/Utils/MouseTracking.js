import * as THREE from 'three';
import gsap from 'gsap';

export default class MouseTracking {
	constructor(webgl, { onClick }) {
		this.webgl = webgl;

    this.scene = this.webgl.scene;
    this.camera = this.webgl.camera;
    this.render = this.webgl.render;
    this.planes = this.webgl.planes;

    this.setInstances();

    window.addEventListener('pointermove', (event) => {
      this.setMouseCoordinates(event);
    });

    window.addEventListener('click', (event) => {
      onClick();
    });
  }

  setInstances() {
    this.raycaster = new THREE.Raycaster();
    this.coordinates = new THREE.Vector2();
    this.position = new THREE.Vector2();
  }

  setMouseCoordinates(event) {
    this.coordinates.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.coordinates.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }

  update({ camera, model }) {
    model ? this.raycaster.setFromCamera(this.coordinates, camera) : this.raycaster.setFromCamera(this.coordinates, this.camera.instance);
    this.intersects = this.raycaster.intersectObjects(this.scene.children, true);
  }
}