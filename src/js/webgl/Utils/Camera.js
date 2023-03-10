import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera {
  constructor(webgl, { activeOrbitControls, model, scene }) {
    this.webgl = webgl;
    this.sizes = this.webgl.sizes;
    this.scene = this.webgl.scene;
    this.canvas = this.webgl.canvas;

    this.viewportSizes = {
      width: 0,
      height: 0,
    }

    this.setInstance({ model, scene });

    if(activeOrbitControls) {
      this.setOrbitcontrols();
    }

    this.resize();
  }

  setInstance({ model, scene }) {
    if(model && scene) {
      this.instance = new THREE.PerspectiveCamera(
        75,
        model.element.width / model.element.height,
        0.1,
        1000,
        );
        this.instance.fov = 2 * Math.atan((this.webgl.sizes.height / 2) / 600) * (180 / Math.PI);
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.position.set(2, 2, 2);
        this.instance.lookAt(scene.position);
        
        this.viewportSizes.height = 2 * Math.tan(this.instance.fov / 2) * this.instance.position.z
        this.viewportSizes.width = this.viewportSizes.height * this.instance.aspect
        
        scene.add(this.instance);
      } else {
        this.instance = new THREE.PerspectiveCamera(
          70,
          this.sizes.width / this.sizes.height,
          100,
          2000,
          );
          this.instance.position.z = 600;
          this.instance.fov = 2 * Math.atan((this.webgl.sizes.height / 2) / 600) * (180 / Math.PI);
          
          this.viewportSizes.height = 2 * Math.tan(this.instance.fov / 2) * this.instance.position.z;
          this.viewportSizes.width = this.viewportSizes.height * this.instance.aspect;
          
          this.scene.add(this.instance);
      }
  }

  setOrbitcontrols() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update(activeOrbitControls) {
    if(activeOrbitControls) {
      this.controls.update();
    }
  }
}