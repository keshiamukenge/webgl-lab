import * as THREE from 'three';

export default class Render {
  constructor(webgl, { canvas, model }) {
    this.webgl = webgl;
    this.canvas = canvas;
    this.sizes = this.webgl.sizes;
    this.scene = this.webgl.scene;
    this.camera = this.webgl.camera;

    this.setInstance({ model });
  }

  setInstance({ model }) {
    this.instance = new THREE.WebGLRenderer({
      canvas: model?.canvas || this.canvas,
      antialias: true,
      alpha: true
    });

    this.instance.setSize(model?.element.width || this.sizes.width, model?.element.height || this.sizes.height);
    this.instance.setPixelRatio(this.sizes.setPixelRatio);
  }

  onResize({ model }) {
    this.instance.setSize(model?.element.width || this.sizes.width, model?.element.height || this.sizes.height);
    this.instance.setPixelRatio(this.sizes.setPixelRatio);
  }

  onUpdate() {
    this.instance.render(this.scene, this.camera.instance);
  }
}