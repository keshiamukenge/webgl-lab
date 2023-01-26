import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export default class Text {
	constructor(webgl) {
		this.webgl = webgl;

		this.scene = this.webgl.scene;

		this.fontLoader = new FontLoader();

		this.loadFont()
	}

	loadFont() {
    this.fontLoader.load('/fonts/Raleway_Bold.json', 
    font => {
      this.textGeometry = new TextGeometry('test',
        {
          font,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        }
      )
    })
    this.textMaterial = new THREE.MeshBasicMaterial()
    this.text = new THREE.Mesh(this.textGeometry, this.textMaterial);
    this.text.position.set(-295.453125, 179.8046875, 1);
    this.text.scale.set(200, 200, 1)
    this.scene.add(this.text);
  }
}