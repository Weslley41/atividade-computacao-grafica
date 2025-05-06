import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Configurações da cena
const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf8f8f8);
const camera = new THREE.PerspectiveCamera(
  75,
  (window.innerWidth * 0.75) / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth * 0.75, window.innerHeight);
document.getElementById("scene-container").appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// Luzes
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Formas Geométricas e Texturas
const geometries = {
  cube: new THREE.BoxGeometry(2, 2, 2),
  sphere: new THREE.SphereGeometry(1.5, 32, 32),
  cylinder: new THREE.CylinderGeometry(1, 1, 3, 32),
};

const materials = {
  cube: new THREE.MeshStandardMaterial({ color: 0xC52613 }),
  sphere: new THREE.MeshStandardMaterial({
    map: textureLoader.load(
      "https://threejs.org/examples/textures/planets/earth_day_4096.jpg"
    ),
  }),
  cylinder: new THREE.MeshStandardMaterial({
    map: textureLoader.load(
      "https://threejs.org/examples/textures/brick_diffuse.jpg"
    ),
  }),
};

const objects = {};
for (const key of Object.keys(geometries)) {
  const mesh = new THREE.Mesh(geometries[key], materials[key]);
  mesh.visible = false;
  scene.add(mesh);
  objects[key] = mesh;
}

let current = objects["sphere"];
current.visible = true;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Funções para manipulação dos objetos
const objectInputs = document.getElementsByName("model-select");
objectInputs.forEach((input) => {
  input.addEventListener("click", (event) => {
    changeObject(event.target.value);
  });
});

function changeObject(newTarget) {
  current.visible = false;
  current = objects[newTarget];
  current.visible = true;
  reset();
}

document.getElementById("pos-x").addEventListener("input", (event) => {
  current.position.x = event.target.value;
});
document.getElementById("pos-y").addEventListener("input", (event) => {
  current.position.y = event.target.value;
});
document.getElementById("rotation-x").addEventListener("input", (event) => {
  current.rotation.x = THREE.MathUtils.degToRad(event.target.value);
});
document.getElementById("rotation-y").addEventListener("input", (event) => {
  current.rotation.y = -THREE.MathUtils.degToRad(event.target.value);
});

document.getElementById("btn-reset").addEventListener("click", reset);
function reset() {
  controls.reset();
  current.position.set(0, 0, 0);
  current.rotation.set(0, 0, 0);

  document.getElementById("pos-x").value = 0;
  document.getElementById("pos-y").value = 0;
  document.getElementById("rotation-x").value = 0;
  document.getElementById("rotation-y").value = 0;
}
