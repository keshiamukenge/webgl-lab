import Webgl from '../../js/webgl/Webgl'

	const vertexShader = `
	uniform vec2 uViewportSizes;
	uniform float uStrength;
	
	varying vec2 vUv;
	
	void main() {
		float PI = 3.1415926535897932384626433832795;
		vec4 newPosition = modelViewMatrix * vec4(position, 1.0);
		
		newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * -uStrength;
		
		vUv = uv;
		
		gl_Position = projectionMatrix * newPosition;
	}
	`
	
	const fragmentShader = `
	precision highp float;
	
	uniform vec2 uImageSizes;
	uniform vec2 uPlaneSizes;
	uniform sampler2D tMap;
	
	varying vec2 vUv;
	
	void main() {
		vec2 ratio = vec2(
			min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
			min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
			);
			
			vec2 uv = vec2(
				vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
				vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
				);
				
				gl_FragColor.rgb = texture2D(tMap, uv).rgb;
				gl_FragColor.a = 1.0;
			}
			`
			
			const webgl = new Webgl({
				imagesElement: document.querySelectorAll('img.grid-img'),
				scrollDirection: "vertical",
				activeOrbitControls: false,
				planeParameters: {
					width: 1,
					height: 1,
					widthSegments: 100,
					heightSegments: 100,
				},
				vertexShader: vertexShader,
				fragmentShader: fragmentShader,
				onUpdate: () => {
					onUpdate()
				},
			})
			
			function onUpdate() {
				webgl.planes.forEach(plane => {
					plane.material.uniforms.uStrength.value = (webgl.scroll.instance.scroll.instance.speed / webgl.sizes.width) * 1000;
				})
			}