import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class Model {
	constructor(webgl, { model, scene }) {
		this.webgl = webgl;
		this.scene = scene;

		this.initModel({ model });
	}

	initModel({ model }) {
		this.gltfLoader = new GLTFLoader()
		this.gltfLoader.load(model.src,
		(gltf) => {
			gltf.scene.scale.set(model.scale.x, model.scale.y, model.scale.z);
			gltf.scene.rotation.set(model.rotation.x, model.rotation.y, model.rotation.z);
			this.scene.add(gltf.scene);
		},
		() => {
			console.log('progress')
		},
		() => {
			console.log('error')
		})
	}

	update() {
		requestAnimationFrame(() => this.update());

		let speed = 3;

		// this.scene?.children[7]?.rotation.set(this.webgl.mouseTracking.coordinates.x * speed, this.webgl.mouseTracking.coordinates.y * speed, 0)
		// this.scene?.children[8]?.rotation.set(this.webgl.mouseTracking.coordinates.x * speed, this.webgl.mouseTracking.coordinates.y * speed, 0)
		// this.scene?.children[9]?.rotation.set(this.webgl.mouseTracking.coordinates.x * speed, this.webgl.mouseTracking.coordinates.y * speed, 0)
	}
}