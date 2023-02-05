import * as THREE from 'three'
import gsap from 'gsap'

import Webgl from '../../js/webgl/Webgl'

const elements = [...document.querySelectorAll('main div canvas')];

const models = [
  {
    src: '/images/effect-3/models/Fox/glTF/Fox.gltf',
    canvas: elements[0],
    scale: {
      x: 0.025,
      y: 0.025,
      z: 0.025,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    element: {
      x: elements[0].getBoundingClientRect().x,
      y: elements[0].getBoundingClientRect().y,
      width: elements[0].clientWidth,
      height: elements[0].clientHeight,
    }
  },
  {
    src: '/images/effect-3/models/FlightHelmet/glTF/FlightHelmet.gltf',
    canvas: elements[1],
    scale: {
      x: 2,
      y: 2,
      z: 2,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    element: {
      x: elements[1].getBoundingClientRect().top,
      y: elements[1].getBoundingClientRect().left,
      width: elements[1].clientWidth,
      height: elements[1].clientHeight,
    }
  },
  {
    src: '/images/effect-3/models/Duck/glTF/Duck.gltf',
    canvas: elements[2],
    scale: {
      x: 1,
      y: 1,
      z: 1,
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
    },
    element: {
      x: elements[2].getBoundingClientRect().x,
      y: elements[2].getBoundingClientRect().y,
      width: elements[2].clientWidth,
      height: elements[2].clientHeight,
    }
  }
]

const webgl = new Webgl({
  type: "model",
  activeOrbitControls: true,
  onUpdate: () => {},
  models: models,
  ambientLight: true,
  directionalLight: true
})

// MOVE MODEL WITH CURSOR
for(let i = 0; i < elements.length; i++) {
  let containerCanvas = elements[i].parentElement;

  containerCanvas.addEventListener('mousemove', () => {
    // console.log(webgl.models[i])
    gsap.to(webgl.models[i].camera.instance.position, {
      x: Math.sin(webgl.mouseTracking.coordinates.x * Math.PI * 2 ) * 2,
      z: Math.cos(webgl.mouseTracking.coordinates.x * Math.PI * 2) * 2,
      y: webgl.mouseTracking.coordinates.y
    })
  })
  containerCanvas.addEventListener('mouseleave', () => {
    gsap.to(webgl.models[i].camera.instance.position, {
      x: 2,
      y: 2,
      z: 2,
      duration: 1,
    })
  })
}