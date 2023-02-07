import * as THREE from 'three';

import { Camera, Render, Sizes, Plane, Scroll, MouseTracking,Time, LoadImages, Model, Light } from './Utils'

export default class Webgl {
	constructor({
    type,
    imagesElement,
    activeOrbitControls,
    planeParameters,
    uniforms,
    vertexShader,
    fragmentShader,
    onUpdate,
    scrollDirection,
    ambientLight,
    directionalLight,
    models,
    onClick
  }) {
    this.type = type;
    this.ambientLight = ambientLight;
    this.directionalLight = directionalLight;
    this.sizes = new Sizes();
    this.time = new Time();
    this.canvas = document.querySelector('canvas');
    this.imagesElements = imagesElement

    this.scroll = new Scroll(this, { direction: scrollDirection });

    if(this.type === "geometry") {
      new LoadImages(this.imagesElements, () => {
        window.webgl = this;
        
        this.setupPlanes({ activeOrbitControls, planeParameters, uniforms, vertexShader, fragmentShader, onUpdate, onClick })
      })
    }

    if(this.type === "model") {
      this.setupModel({ onUpdate, models });
    }

    // if(this.ambientLight) {
    //   new Light(this).addAmbientLight();
    // }

    // if(this.directionalLight) {
    //   new Light(this).addDirectionalLight();
    // }
	}

  setupPlanes({ activeOrbitControls, planeParameters, uniforms, vertexShader, fragmentShader, onUpdate, onClick }) {
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
    
    this.render = new Render(this, { canvas: document.querySelector('canvas') });
    this.mouseTracking = new MouseTracking(this, { onClick });
      
    this.onResizeWindow({ model: null });

    this.planes.forEach(plane => {
      plane.updateSize();
    })

    this.animate(onUpdate);
  }

  setupModel({ onUpdate, models, onClick }) {
    this.models = models.map(model => {
      let scene = new THREE.Scene();
      let camera = new Camera(this, { activeOrbitControls: model.activeOrbitControls, model, scene });
      let gltfModel = new Model(this, {
        model,
        scene: scene,
      });
      let render = new Render(this, { canvas: model.canvas, model });
      new Light(this, { scene }).addAmbientLight();
      new Light(this, { scene }).addDirectionalLight();

      this.onResizeWindow({ model });

      return {
        scene: scene,
        camera: camera,
        model: gltfModel,
        render: render
      };
    })

    this.mouseTracking = new MouseTracking(this, { onClick });
      
    this.animate(onUpdate);
  }

  onResizeWindow({ model }) {
    window.addEventListener('resize', () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this?.camera?.update();
      this.camera.resize();

      this.planes.forEach(plane => {
        plane.updateSize();
        plane.updatePosition();

        console.log("plane : " + plane.instance.scale.x, plane.instance.position.x);
        console.log("img : " + plane.imageElement.offsetWidth, plane.imageElement.getBoundingClientRect().left);
      })

      this.render.onResize({ model });
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
    
    this.scroll.instance.on('scroll', () => {
      if(this.type === "geometry") {
        this.planes.forEach(plane => {
          plane.updatePosition();
        })
      }
    })

    this.mouseTracking.update({ camera: null, model: null });
    
    if(this.type === "model") {
      this.models.forEach(model => {
        model.render.instance.render(model.scene, model.camera.instance);
      })
    }
    
    this.onUpdate(onUpdate)
    this.render.onUpdate();
  }
}