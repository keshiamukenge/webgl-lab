import gsap, { Power2 } from 'gsap'
import * as THREE from 'three'

import Webgl from '../../js/webgl/Webgl'
import SplitText from '../../js/SplitText'

// WEBGL
const vertexShader = `
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
           
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  
  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  
  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

uniform float uTime;
uniform float uFrequence;
uniform float uAmplitude;

varying vec2 vUv;
varying float vWave;

void main() {
  vec3 newPosition = position;
  float noiseFreq = uAmplitude;
  float noiseAmp = uFrequence; 

  // vec3 noisePos = vec3(sin(newPosition.x * noiseFreq + uTime), newPosition.y, newPosition.z);
  // newPosition.z += snoise(noisePos) * noiseAmp;
	// vWave = newPosition.z;

  vec3 noisePos = vec3(newPosition.x * noiseFreq + uTime, newPosition.y, newPosition.z);
  newPosition.z += snoise(noisePos) * noiseAmp;
  vWave = newPosition.z;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

	vUv = uv;
}`

const fragmentShader = `
precision mediump float;

uniform sampler2D tMap;
uniform float uAlpha;
uniform float uAspect;

varying vec2 vUv;
varying float vWave;

void main() {
	float wave = vWave * 0.001;

  float r = texture2D(tMap, vUv + wave).r;
  float g = texture2D(tMap, vUv).g;
  float b = texture2D(tMap, vUv + wave).b;

  vec3 texture = vec3(r, g, b);
  gl_FragColor = vec4(texture, uAlpha);
}`

const clock = new THREE.Clock();

const webgl = new Webgl({
  type: "geometry",
	imagesElement: document.querySelectorAll('img'),
  scrollDirection: "horizontal",
	activeOrbitControls: false,
	planeParameters: {
		width: 1,
		height: 1,
		widthSegments: 350,
		heightSegments: 350,
	},
  uniforms: {
    uFrequence: {
      value: 0.0
    },
    uAmplitude: {
      value: 0.0
    },
    uAlpha: {
      value: 0.0
    }
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

let clickedMesh = null;
let isOpen = false;
let clickedImage = null;
const boundingBox = new THREE.Box3();

function onClick() {
  if(!isOpen) {
    if(webgl.mouseTracking.intersects?.length > 0) {
      window.removeEventListener('click', onClick);
      isOpen = !isOpen;
      clickedMesh = webgl.mouseTracking.intersects[0].object;
      
      boundingBox.setFromObject(clickedMesh);
      const center = boundingBox.getCenter(new THREE.Vector3());
    
      webgl.planes.forEach(plane => {
        if(plane.instance.uuid === clickedMesh.uuid) {
          clickedImage = plane.imageElement;
          gsap.to(plane.imageElement, {
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 0.8,
            delay: 0.2,
            ease: Power2.easeInOut
          })

          gsap.to('.item-1__text div span', {
            y: 0,
            duration: 0.6,
            stagger: 0.05,
            delay: 1
          })
        }
        
        if(plane.instance.uuid !== clickedMesh.uuid) {
          gsap.to(plane.instance.material.uniforms.uAlpha, {
            value: 0.0,
            duration: 0.8,
            onComplete: () => {
              plane.instance.visible = false;
            }
          })

          gsap.to(webgl.camera.instance.position, {
            x: center.x,
            y: center.y,
            duration: 1,
            delay: 0.4,
            ease: Power2.easeInOut,
          })
        }
      })
    }
  } else {
    if(clickedImage) {
      gsap.to('.item-1__text div span', {
        y: 100 + "%",
        duration: 0.6,
        stagger: 0.05,
      })

      gsap.to(clickedImage, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.8,
        delay: 0.5,
        ease: Power2.easeInOut
      })

      gsap.to(webgl.camera.instance.position, {
        x: 0,
        y: 0,
        duration: 1,
        delay: 0.4,
        ease: Power2.easeInOut,
        onComplete: () => {
          webgl.planes.forEach(plane => {
            if(plane.instance.uuid !== clickedMesh.uuid) {
              gsap.to(plane.instance, {
                visible: true,
                duration: 0.5,
              })
              gsap.to(plane.instance.material.uniforms.uAlpha, {
                value: 0.8,
                duration: 1,
                onComplete: () => {
                  clickedImage = clickedMesh = null;
                  isOpen = !isOpen;
                }
              })
            }
          })
        }
      })
    }
  }
}

function onEnter() {
  if(!isOpen) {
    if(webgl.mouseTracking.intersects?.length > 0) {
      const intersectedMesh = webgl.mouseTracking.intersects[0].object;
      
      gsap.to(intersectedMesh.material.uniforms.uFrequence, {
        value: 25.5,
        duration: 2,
      });
      
      gsap.to(intersectedMesh.material.uniforms.uAmplitude, {
        value: 2.5,
        duration: 2,
      });
      
      gsap.to(intersectedMesh.material.uniforms.uAlpha, {
        value: 1.0,
        duration: 1,
      });
    } else {
        webgl.planes.forEach(plane => {
          gsap.to(plane.material.uniforms.uFrequence, {
            value: 0.0,
            duration: 2,
          });
          
          gsap.to(plane.material.uniforms.uAmplitude, {
            value: 0.0,
            duration: 2,
          });
          
          gsap.to(plane.material.uniforms.uAlpha, {
            value: 0.8,
            duration: 1,
          });
        })
    }
  }
}

function onUpdate() {
	webgl.planes.forEach(plane => {
		plane.material.uniforms.uTime.value = clock.getElapsedTime();
	})
}

new SplitText('.item-1__text', "5px");