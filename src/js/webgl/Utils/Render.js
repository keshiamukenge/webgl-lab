import * as THREE from 'three';

export default class Render {
  constructor(webgl) {
    this.webgl = webgl;
    this.canvas = this.webgl.canvas;
    this.sizes = this.webgl.sizes;
    this.scene = this.webgl.scene;
    this.camera = this.webgl.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.setPixelRatio);
  }

  onResize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.setPixelRatio);
  }

  onUpdate() {
    this.instance.render(this.scene, this.camera.instance);
  }
}