import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus
//verschiedene Materialien
const geometry = new THREE.TorusGeometry(9, 3, 25, 100);
//const geometry = new THREE.TorusKnotGeometry(5, 1, 8, 50)
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

//wird nicht vom licht beinflusst
const geometry2 = new THREE.TorusGeometry(3, 1, 25, 100);
//const geometry = new THREE.TorusKnotGeometry(5, 1, 8, 50)
const material2 = new THREE.MeshBasicMaterial({ color: 0xff6347 });
const torus2 = new THREE.Mesh(geometry2, material2);
scene.add(torus2);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(400).fill().forEach(addStar);


// Background
                                                        //space.jpg
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar

const biglTexture = new THREE.TextureLoader().load('Bigl.jpg');

const bigl = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: biglTexture }));

scene.add(bigl);

// Moon
                                                        //moon.jpg
const moonTexture = new THREE.TextureLoader().load('bigl.jpg');
const normalTexture = new THREE.TextureLoader().load('bbigl.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

bigl.position.z = -5;
bigl.position.x = 2;


//probe
const rechtTexture = new THREE.TextureLoader().load('kufn.jpg');
const nTexture = new THREE.TextureLoader().load('kufn1.jpg');

const recht = new THREE.Mesh(
    new THREE.BoxGeometry(3, 5, 5),
    new THREE.MeshStandardMaterial({
      map: rechtTexture,
      normalMap: nTexture,
    })
);

scene.add(recht);
recht.position.z = 15;
recht.position.setX(-5);


// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  bigl.rotation.y += 0.01;
  bigl.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

  recht.rotation.y += 0.01;
  recht.rotation.z += 0.01;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop





//Blender Maus
let gltfAnimations;
let mixer;
const loader = new GLTFLoader();
loader.load(
    '/W_hlmaus.glb',
    function (gltf) {
// Scale the loaded model (8 times bigger)
        gltf.scene.scale.set(2,2,2);
// Move the loaded model down (50% down)

        scene.add(gltf.scene);
        gltfAnimations = gltf.animations;
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
// Initialize the mixer
        mixer = new THREE.AnimationMixer(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
// called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);
function animate() {
  requestAnimationFrame(animate);
  //blend
  if (gltfAnimations) {
        mixer.clipAction(gltfAnimations[0]).play();
        mixer.update(0.01);

    }
    renderer.render(scene, camera);


    torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  torus2.rotation.x += 0.005;
  torus2.rotation.y += 0.005;
  torus2.rotation.z += 0.005;

  moon.rotation.x += 0.005;
  recht.rotation.x += 0.005;
  bigl.rotation.x += 0.002;
  // controls.update();

  renderer.render(scene, camera);
}

animate();
