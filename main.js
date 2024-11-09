import gsap from "gsap";
import * as THREE from 'three';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';

const lenis = new Lenis();

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
camera.position.z = 3;
scene.add(camera);

const sphereGeometry = new THREE.IcosahedronGeometry(1.7, 128, 128);
const sphereMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: { value: 0 },
    uColor: { value:0.0 }
  },
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y=-2.2
scene.add(sphere);
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = ()=>{
  const elapsedTime = clock.getElapsedTime();
  sphereMaterial.uniforms.uTime.value = elapsedTime;
  renderer.render(scene, camera);
  sphere.rotation.x = elapsedTime*.02
  sphere.rotation.y = elapsedTime*.02
  window.requestAnimationFrame(tick);
}
tick()














gsap.registerPlugin(ScrollTrigger);

//const navHeight = document.querySelector('header').getBoundingClientRect().height;

const tl = gsap.timeline({
  defaults:{
    ease:'none'
  },
  scrollTrigger: {
    trigger:'.hero',
    start:'top top',
    end:'+=800',
    scrub:2,
    pin:true,
  }
})

tl.to('.hero-text-1',{
  opacity:0,
  y:-20
})
.to(sphere.position,{
  y:0,
  z:-1
},'<')
.to(sphereMaterial.uniforms.uColor,{
  value:1.0,
  duration:.5
},'-=.3')
.from('.hero-text-2',{
  y:20
})
.to('.hero-text-2',{
  opacity:1,
},'<')


const projectsTl = gsap.timeline({
  defaults:{
    ease:'none'
  },
  scrollTrigger: {
    trigger:'.projects',
    start:'top top',
    end:'bottom bottom',
    scrub:1,
    pin:'.images-section',
  }
})

projectsTl.to('.image1',{
  clipPath:'inset(0px 0px 100%)',
})
.to('.image2',{
  clipPath:'inset(0px 0px 100%)',
})
.to('.image3',{
  clipPath:'inset(0px 0px 100%)',
})
.to('.image4',{
  clipPath:'inset(0px 0px 100%)',
}) 

const projects = [...document.querySelectorAll('.project')];


projects.forEach((p, i) => {
  const color = p.dataset.color;

  gsap.to(p, {
    scrollTrigger: {
      trigger: p,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => {
        gsap.to('body', {
          backgroundColor: color,
          duration: 1,
          ease: 'power4.out'
        });
      },
      // onLeave: () => {
      //   const nextColor = i < projects.length - 1 ? projects[i + 1].dataset.color : color;
      //   gsap.to('body', {
      //     backgroundColor: nextColor,
      //     duration: 1,
      //     ease: 'power4.out'
      //   });
      // },
      onEnterBack: () => {
        gsap.to('body', {
          backgroundColor: color,
          duration: 1,
          ease: 'power4.out'
        });
      },
      onLeaveBack: () => {
        if(i==0){
          gsap.to('body', {
            backgroundColor: '#fff',
            duration: 1,
            ease: 'power4.out'
          });
        }
      }
    }
  });
});
