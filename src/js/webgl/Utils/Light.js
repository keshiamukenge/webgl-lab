import * as THREE from 'three';

export default class Light {
	constructor(webgl, { scene }) {
		 this.webgl = webgl;
		 this.scene = scene;
	}
	addAmbientLight() {
		this.ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
		this.scene.add(this.ambientLight)
	}

	addDirectionalLight() {
		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
		this.directionalLight.castShadow = true
		this.directionalLight.shadow.mapSize.set(1024, 1024)
		this.directionalLight.shadow.camera.far = 15
		this.directionalLight.shadow.camera.left = - 7
		this.directionalLight.shadow.camera.top = 7
		this.directionalLight.shadow.camera.right = 7
		this.directionalLight.shadow.camera.bottom = - 7
		this.directionalLight.position.set(- 5, 5, 0)
		this.scene.add(this.directionalLight)
	}
}