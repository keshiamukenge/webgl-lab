// import gsap, { Power2 } from 'gsap'
import * as THREE from 'three'

import Webgl from '../../js/webgl/Webgl'

// WEBGL
const vertexShader = `
		uniform float uAngle;
		uniform float uProgress;
		uniform float uTime;
		uniform vec4 uResolution;
		varying float vFrontShadow;
		varying vec2 vUv;

		mat4 rotationMatrix(vec3 axis, float angle) {
			axis = normalize(axis);
			float s = sin(uAngle);
			float c = cos(uAngle);
			float oc = 1.0 - c;
					
			return mat4(
				oc * axis.x * axis.x + c,
				oc * axis.x * axis.y - axis.z * s,
				oc * axis.z * axis.x + axis.y * s,
				0.0,
				oc * axis.x * axis.y + axis.z * s,
				oc * axis.y * axis.y + c,
				oc * axis.y * axis.z - axis.x * s,
				0.0,
				oc * axis.z * axis.x - axis.y * s,
				oc * axis.y * axis.z + axis.x * s,
				oc * axis.z * axis.z + c,
				0.0,
				0.0,
				0.0,
				0.0,
				1.0
			);
		}
		vec3 rotate(vec3 v, vec3 axis, float angle) {
			mat4 m = rotationMatrix(axis, angle);
			return (m * vec4(v, 1.0)).xyz;
		}
		void main() {
			float pi = 3.1415925;
			float finalAngle = uAngle - 0.*0.3*sin(uProgress*6.);
			
			vec3 newposition = position;
			float rad = 0.1;
  		float rolls = 8.;
			
			newposition = rotate(newposition - vec3(-.5,.5,0.), vec3(0.,0.,1.),-finalAngle) + vec3(-.5,.5,0.);
			
			float offs = (newposition.x + 0.5)/(sin(finalAngle) + cos(finalAngle));
			float tProgress = clamp( (uProgress - offs*0.99)/0.01 , 0.,1.);
			vFrontShadow = clamp((uProgress - offs*0.95)/0.05,0.7,1.);
			newposition.z =  rad + rad*(1. - offs/2.)*sin(-offs*rolls*pi - 0.5*pi);
  		newposition.x =  - 0.5 + rad*(1. - offs/2.)*cos(-offs*rolls*pi + 0.5*pi);
			
			newposition = rotate(newposition - vec3(-.5,.5,0.), vec3(0.,0.,1.),finalAngle) + vec3(-.5,.5,0.);
			newposition = rotate(newposition - vec3(-.5,0.5,rad), vec3(sin(finalAngle),cos(finalAngle),0.), -pi*uProgress*rolls);
  		newposition +=  vec3(
				-.5 + uProgress*cos(finalAngle)*(sin(finalAngle) + cos(finalAngle)),
				0.5 - uProgress*sin(finalAngle)*(sin(finalAngle) + cos(finalAngle)),
    		rad*(1.-uProgress/2.)
  		);
			vec3 finalposition = mix(newposition, position, tProgress);
  		gl_Position = projectionMatrix * modelViewMatrix * vec4(finalposition, 1.0);
			vUv = uv;
		}
	`;

  const fragmentShader = `
		uniform sampler2D tMap;
		uniform vec4 uResolution;
		uniform float uTime;
		uniform float uProgress;
		varying float vFrontShadow;
		varying vec2 vUv;
    
		void main() {
			vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5);
			gl_FragColor = texture2D(tMap,newUV);
    	gl_FragColor.rgb *=vFrontShadow;
    	// gl_FragColor.a = clamp(uProgress*5.,0.,1.);
		}
	`;

const clock = new THREE.Clock();

const webgl = new Webgl({
  type: "geometry",
	imagesElement: document.querySelectorAll('img'),
  scrollDirection: "vertical",
	activeOrbitControls: false,
	planeParameters: {
		width: 1,
		height: 1,
		widthSegments: 100,
		heightSegments: 100,
	},
  uniforms: {
    uProgress: { 
      value: 0
    },
    uAngle: { 
      value: 0
    },
    uResolution: {
      value: new THREE.Vector4(1, 1, 1, 1)
    },
    uvRate1: {
      value: new THREE.Vector2(1, 1)
    },
  },
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
	onUpdate: () => {
		onUpdate()
    onEnter()
	},
  onClick: () => {
    onClick();
  }
})

function onClick() {
  
}

function onEnter() {
  
}

function onUpdate() {
	
}

window.addEventListener('mousemove', () => {
  webgl.planes.forEach(plane => {
    plane.instance.material.uniforms.uProgress.value = webgl.mouseTracking.coordinates.x
  })
})

console.log(webgl)