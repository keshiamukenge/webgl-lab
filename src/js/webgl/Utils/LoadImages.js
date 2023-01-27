import * as THREE from 'three';

export default class LoadImages {
	constructor(imagesElement, initWebgl) {
		this.instance = new THREE.LoadingManager()

		imagesElement.forEach(imageElement => {
			let loader = new THREE.ImageLoader(this.instance);
			loader.load(imageElement.src);
		})

		this.instance.onLoad = () => {
			initWebgl();
		}
	}
}