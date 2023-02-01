import * as THREE from 'three';

import { Camera, Render, Sizes, Plane, Scroll, MouseTracking,Time, LoadImages } from './Utils'

export default class Webgl {
	constructor({ imagesElement, activeOrbitControls, planeParameters, uniforms, vertexShader, fragmentShader, onUpdate, scrollDirection }) {
    this.sizes = new Sizes();
    this.time = new Time();
    this.canvas = document.querySelector('canvas');
    this.imagesElements = imagesElement

    this.scroll = new Scroll(this, { direction: scrollDirection });

    new LoadImages(this.imagesElements, () => {
      window.webgl = this;

      this.setup({ activeOrbitControls, planeParameters, uniforms, vertexShader, fragmentShader, onUpdate })
    })
	}

  setup({ activeOrbitControls, planeParameters, uniforms, vertexShader, fragmentShader, onUpdate }) {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this, { activeOrbitControls });
    
    this.planes = [...this.imagesElements].map(imageElement => {
      return new Plane(this, {
        imgElement: imageElement,
        planeParameters,
        uniforms,
        vertexShader,
        fragmentShader,
      });
    })
    
    this.render = new Render(this);
    this.mouseTracking = new MouseTracking(this);
      
    this.onResizeWindow();
    this.animate(onUpdate);
  }

  onResizeWindow() {
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.planes.forEach(plane => {
        plane.updateSize();
      })

      this.camera.update();

      this.render.onResize();
    });
  }

  onMouseMove() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.onMouseMove(event);
    });
  }

  onUpdate(onUpdate) {
    onUpdate()
  }

  animate(onUpdate) {
    requestAnimationFrame(() => this.animate(onUpdate));

    this.time.tick();
    
    this.planes.forEach(plane => {
      plane.update();
      plane.updateSize();
    })

    this.onUpdate(onUpdate)

    this.mouseTracking.update();
    
    this.render.onUpdate();
  }
}