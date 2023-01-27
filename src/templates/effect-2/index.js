import Webgl from '../../js/webgl/Webgl'

const vertexShader = `
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float snoise3(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

uniform float uTime;

varying vec2 vUv;
varying float vWave;

void main() {
  vec3 newPosition = position;
  float noiseFreq = 10.45;
  float noiseAmp = 6.15; 
  vec3 noisePos = vec3(sin(newPosition.x * noiseFreq + uTime), newPosition.y, newPosition.z);
  
  newPosition.z += snoise3(noisePos) * noiseAmp;
	vWave = newPosition.z;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

	vUv = uv;
}
`

const fragmentShader = `
precision mediump float;

uniform sampler2D tMap;

varying vec2 vUv;
varying float vWave;

void main() {
	float wave = vWave * 0.002;

  float r = texture2D(tMap, vUv).r;
  float g = texture2D(tMap, vUv + wave).g;
  float b = texture2D(tMap, vUv + wave).b;

  vec3 texture = vec3(r, g, b);
  gl_FragColor = vec4(texture, 1.);
}
`

const webgl = new Webgl({
	imagesElement: document.querySelectorAll('img'),
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
		plane.material.uniforms.uTime.value = webgl.time.elapsed * 0.005;
	})
}