import * as THREE from 'three';

export default class Plane {
  constructor(webgl, { imgElement, planeParameters, uniforms, vertexShader, fragmentShader }) {
    this.webgl = webgl;

		this.scene = this.webgl.scene;
		this.camera = this.webgl.camera;
		this.sizes = this.webgl.sizes;
		this.viewportSizes = this.webgl.viewportSizes;
		this.scroll = this.webgl.scroll;
		this.mouse = this.webgl.mouse;

    this.imageElement = imgElement;
    this.image = {
      element: this.imageElement,
      src: this.imageElement.src,
      width: this.imageElement.getBoundingClientRect().width,
      height: this.imageElement.getBoundingClientRect().height,
      aspect: this.imageElement.offsetWidth / this.imageElement.offsetHeight,
      top: this.imageElement.getBoundingClientRect().top,
      left: this.imageElement.getBoundingClientRect().left,
			selected: false,
    };

    this.texture = new THREE.TextureLoader().load(this.image.src);
		this.materialTemplate = new THREE.ShaderMaterial({
			transparent: true,
			uniforms: {
				tMap: {
					value: this.texture
				},
				uAspect: {
					value: new THREE.Vector2(0, 0)
				},
				uViewportSizes: {
					value: new THREE.Vector2(this.sizes.width, this.sizes.height)
				},
    		uStrength: {
					value: 0
				},
				uTime: {
					value: 0
				},
				uHover: {
					value: new THREE.Vector2(0.5, 0.5),
				},
				uHoverState: {
					value: 1.0,
				},
				...uniforms
			},
			vertexShader,
			fragmentShader,
		})

    this.setupPlane({ planeParameters, uniforms });
  }

  setupPlane({ planeParameters }) {
    this.geometry = new THREE.PlaneGeometry(
			planeParameters.width,
			planeParameters.height,
			planeParameters.widthSegments,
			planeParameters.heightSegments
		);

    this.material = this.materialTemplate.clone()
		this.material.uniforms = THREE.UniformsUtils.clone(this.materialTemplate.uniforms);
  	this.material.vertexShader = this.materialTemplate.vertexShader;
  	this.material.fragmentShader = this.materialTemplate.fragmentShader;

    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.position.set(
			this.image.left + this.image.width / 2 - this.webgl.sizes.width / 2,
			this.webgl.sizes.height / 2 - this.image.top - this.image.height / 2,
			0.5,
		);
		this.instanceOffset = this.instance.scale.y / 2;

		this.scene.add(this.instance);
  }

  updateImagePosition() {
    this.image.top = this.imageElement.getBoundingClientRect().top;
    this.image.left = this.imageElement.getBoundingClientRect().left;
  }

  updatePlanePosition() {
    this.instance.position.set(
			this.image.left + this.image.width / 2 - this.webgl.sizes.width / 2,
			this.webgl.sizes.height / 2 - this.image.top - this.image.height / 2,
			0.5,
		);
  }

  updatePlaneSize() {
    this.instance.scale.set(this.image.width, this.image.height, 1);
  }

	updateImageSize() {
		this.image.width = this.imageElement.getBoundingClientRect().width;
    this.image.height = this.imageElement.getBoundingClientRect().height;
	}

	updatePosition() {
		this.updateImagePosition();
		this.updatePlanePosition();
	}

	updateSize() {
		this.updatePlaneSize();
		this.updateImageSize();
		this.instance.material.uniforms.uAspect.value = this.image.width / this.image.height;
	}
}
