import * as THREE from 'three';

export default class Plane {
  constructor(webgl, { imgElement, planeParameters, uniforms, vertexShader, fragmentShader }) {
    this.webgl = webgl;

		this.scene = this.webgl.scene;
		this.camera = this.webgl.camera;
		this.sizes = this.webgl.sizes;
		this.viewportSizes = this.webgl.viewportSizes;
		this.scroll = this.webgl.scroll;

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

    this.setupPlane({ planeParameters, uniforms, vertexShader, fragmentShader });
  }

  setupPlane({ planeParameters, uniforms, vertexShader, fragmentShader }) {
    this.geometry = new THREE.PlaneGeometry(
			planeParameters.width,
			planeParameters.height,
			planeParameters.widthSegments,
			planeParameters.heightSegments
		);
    this.material = new THREE.ShaderMaterial({
			transparent: true,
			uniforms: {
				tMap: { value: this.texture },
				uPlaneSizes: { value: new THREE.Vector2(0, 0) },
				uImageSizes: { value: new THREE.Vector2(0, 0) },
				uViewportSizes: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
    		uStrength: { value: 0 },
				uTime: { value: 0 },
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
		});
    this.instance = new THREE.Mesh(this.geometry, this.material);
    this.instance.scale.set(this.image.width, this.image.height, 1);
		this.instanceOffset = this.instance.scale.y / 2;

		this.instance.callback = (mesh) => {
			window.addEventListener('click', () => {
				this.image.selected = true
				// gsap.to(mesh.position, {
				// 	x: this.sizes.width * 0.5 + mesh.position.x,
				// 	y: this.sizes.viewportOffset - mesh.position.y,
				// 	z: 5,
				// 	duration: 1
				// })
			})
		}

		this.scene.add(this.instance);
  }

  updateImageSize() {
    this.image.width = this.instance.material.uniforms.uImageSizes.x = this.imageElement.getBoundingClientRect().width;
    this.image.height = this.instance.material.uniforms.uImageSizes.y = this.imageElement.getBoundingClientRect().height;
    this.image.aspect = this.imageElement.offsetWidth / this.imageElement.offsetHeight;
  }

  updateImagePosition() {
    this.image.top = -this.imageElement.getBoundingClientRect().top;
    this.image.left = this.imageElement.getBoundingClientRect().left;
  }

  updatePlaneSize() {
    this.instance.scale.set(this.image.width, this.image.height, 1);
		this.instance.material.uniforms.uPlaneSizes.value = [this.instance.scale.x, this.instance.scale.y]
  }

  updatePlanePosition() {
			this.instance.position.set(
				this.image.left - this.webgl.sizes.width / 2 + this.image.width / 2,
				this.image.top + this.webgl.sizes.height / 2 - this.image.height / 2,
				1,
			);
  }

	update() {
		this.updateImagePosition();
		this.updatePlanePosition();

		this.texture.needsUpdate = true;
	}

	updateSize() {
		this.updatePlaneSize();
		this.updateImageSize();
	}
}
