// js/modulo1-3d.js
console.log('modulo1-3d.js cargado');

import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = 'assets/modelo/cuerpo.glb';

const DOM_DELTA_LINE = 1;
const DOM_DELTA_PAGE = 2;

const CAMERA_MIN_DISTANCE = 0.75;
const CAMERA_MAX_DISTANCE = 8.5;
const CAMERA_WHEEL_SPEED = 0.0011;
const CAMERA_WHEEL_FINE = 0.35;

// Utils
const deg2rad = d => (d * Math.PI) / 180;
const rad2deg = r => (r * 180) / Math.PI;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const zoomVector = new THREE.Vector3();

// DOM
const stage = document.getElementById('stage3d');
const btnToggleLight = document.getElementById('toggleLight');
const presetSelect = document.getElementById('presetLight');
const sliderIntensity = document.getElementById('intensity');
const btnReset = document.getElementById('reset3d');
const readout = document.getElementById('readout');

// Render/escena
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0d12);

const camera = new THREE.PerspectiveCamera(50, 16/9, 0.1, 100);
camera.position.set(2.6, 1.6, 3.2);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enableZoom = true;
controls.zoomSpeed = 0.9;
controls.minDistance = CAMERA_MIN_DISTANCE;
controls.maxDistance = CAMERA_MAX_DISTANCE;

// Suelo Y=0
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x141923, roughness: 0.95 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Luces base
const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.35);
scene.add(hemi);

const rim = new THREE.DirectionalLight(0xffffff, 0.45);
rim.position.set(-2.2, 1.6, -1.8);
scene.add(rim);

// Luz principal
const keyLight = new THREE.SpotLight(0xffffff, 2.4, 0, deg2rad(28), 0.25, 1.8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.bias = -0.00008;
scene.add(keyLight);
scene.add(keyLight.target);

// Bombilla visible
const bulb = new THREE.Mesh(
  new THREE.SphereGeometry(0.05, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xffd382 })
);
scene.add(bulb);

// ===== EsfÃ©ricas de la luz (Blender-like) =====
// THREE.Spherical: r, phi (0..PI desde +Y), theta (acimut).
const L = new THREE.Spherical(2.4, deg2rad(90 - 30), deg2rad(35));
const R_MIN = 1.2, R_MAX = 6.0;
const PHI_MIN = deg2rad(0.5);              // evita singularidad
const PHI_MAX = Math.PI / 2 - deg2rad(0.5); // no cruza el piso

// Altura del objetivo (pecho)
let targetY = 1.0;

function placeKeyLight() {
  L.radius = clamp(L.radius, R_MIN, R_MAX);
  L.phi = clamp(L.phi, PHI_MIN, PHI_MAX);

  const pos = new THREE.Vector3().setFromSpherical(L);
  keyLight.position.copy(pos);
  keyLight.target.position.set(0, targetY, 0);
  bulb.position.copy(pos);

  const elev = 90 - rad2deg(L.phi);
  const az = rad2deg(L.theta);
  readout.textContent = `Luz: Az ${Math.round(az)}\u00B0 \u00B7 El ${Math.round(elev)}\u00B0`;
}
placeKeyLight();

sliderIntensity.addEventListener('input', () => {
  keyLight.intensity = parseFloat(sliderIntensity.value);
});

function normalizeWheelDelta(event) {
  if (event.deltaMode === DOM_DELTA_LINE) return event.deltaY * 32;
  if (event.deltaMode === DOM_DELTA_PAGE) return event.deltaY * 256;
  return event.deltaY;
}

function applyCameraZoom(delta, fine = false) {
  if (!controls.enableZoom) return;
  const offset = zoomVector.subVectors(camera.position, controls.target);
  const distance = offset.length();
  if (!distance) return;

  const baseSpeed = CAMERA_WHEEL_SPEED * (fine ? CAMERA_WHEEL_FINE : 1);
  const deltaDistance = delta * baseSpeed * Math.max(distance, 0.25);
  const nextDistance = clamp(deltaDistance + distance, CAMERA_MIN_DISTANCE, CAMERA_MAX_DISTANCE);

  offset.setLength(nextDistance);
  camera.position.copy(controls.target).add(offset);
  controls.update();
}

// === Modelo (pies al suelo y centro X/Z) ===
const loader = new GLTFLoader();
let model;
loader.load(
  MODEL_URL,
  (gltf) => {
    model = gltf.scene;
    model.traverse(o => { if (o.isMesh) o.castShadow = true; });

    // Escalar a ~1.8u de alto
    const box1 = new THREE.Box3().setFromObject(model);
    const size1 = new THREE.Vector3(); box1.getSize(size1);
    const scale = 1.8 / size1.y; model.scale.setScalar(scale);

    // Reposicionar: pies a Y=0, centro X/Z en 0
    const box2 = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3(); box2.getCenter(center);
    model.position.x -= center.x;
    model.position.z -= center.z;
    model.position.y -= box2.min.y;

    // Recalcular caja ya alineada para ubicar el centro de interés en el pecho
    box2.setFromObject(model);
    const size2 = new THREE.Vector3(); box2.getSize(size2);
    targetY = box2.min.y + size2.y * 0.55;
    placeKeyLight();

    controls.target.set(0, targetY, 0);
    controls.update();
    controls.saveState();

    scene.add(model);
    console.log('Modelo cargado y alineado al suelo:', MODEL_URL);
  },
  undefined,
  (err) => {
    console.warn('No se pudo cargar el modelo:', MODEL_URL, err);
  }
);

// ===== InteracciÃ³n tipo Blender =====
let movingLight = false;
let drag = { active:false, x:0, y:0, theta0:0, phi0:0 };

btnToggleLight?.addEventListener('click', () => {
  movingLight = !movingLight;
  btnToggleLight.textContent = `Mover luz con el mouse: ${movingLight ? 'ON' : 'OFF'}`;
  btnToggleLight.classList.toggle('btn-warning', movingLight);
  btnToggleLight.classList.toggle('btn-outline-warning', !movingLight);
  controls.enabled = !movingLight;
  controls.enableZoom = !movingLight; // rueda controla luz cuando ON
});

// Arrastre: ON â†’ ajusta theta/phi. Alt = solo horizontal, Ctrl = solo vertical, Shift = fino.
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (!movingLight) return;
  drag.active = true;
  drag.x = e.clientX; drag.y = e.clientY;
  drag.theta0 = L.theta; drag.phi0 = L.phi;
});
window.addEventListener('pointermove', (e) => {
  if (!drag.active) return;
  const fine = e.shiftKey ? 0.003 : 0.01;
  const dx = (e.clientX - drag.x) * fine;
  const dy = (e.clientY - drag.y) * fine;

  if (e.ctrlKey) {
    // solo vertical
    L.phi = drag.phi0 + dy;
  } else if (e.altKey) {
    // solo horizontal
    L.theta = drag.theta0 + dx;
  } else {
    // libre
    L.theta = drag.theta0 + dx;
    L.phi   = drag.phi0   + dy;
  }
  placeKeyLight();
});
window.addEventListener('pointerup', () => { drag.active = false; });

// Rueda: ON â†’ acerca/aleja la luz sobre su direcciÃ³n actual (Shift = fino)
renderer.domElement.addEventListener('wheel', (e) => {
  const delta = normalizeWheelDelta(e);

  if (movingLight) {
    e.preventDefault();
    const k = e.shiftKey ? 0.003 : 0.01;
    L.radius = clamp(L.radius + delta * k, R_MIN, R_MAX);
    placeKeyLight();
    e.stopPropagation();
    return;
  }

  if (!controls.enableZoom) return;

  e.preventDefault();
  applyCameraZoom(delta, e.shiftKey);
  e.stopPropagation();
}, { passive: false, capture: true });

// ===== Presets =====
function applyPreset(name) {
  const elev = (deg) => { L.phi = deg2rad(90 - deg); }; // elevaciÃ³n en grados
  switch (name) {
    case 'cenital':        // arriba, suave
      elev(70);            // 70Â° sobre el horizonte
      L.theta = deg2rad(45);
      L.radius = 2.6;
      break;
    case 'contrapicada':   // desde abajo (muy baja elevaciÃ³n, sin cruzar piso)
      elev(5);             // casi a ras del suelo
      L.theta = deg2rad(0);
      L.radius = 2.2;
      break;
    case 'perfil_izq':     // 90Â° izquierda
      elev(20);
      L.theta = deg2rad(270);
      L.radius = 2.4;
      break;
    case 'perfil_der':     // 90Â° derecha
      elev(20);
      L.theta = deg2rad(90);
      L.radius = 2.4;
      break;
    default:
      return;
  }
  placeKeyLight();
}

presetSelect?.addEventListener('change', (e) => {
  applyPreset(e.target.value);
});

// Reset
btnReset.addEventListener('click', () => {
  L.radius = 2.4; L.phi = deg2rad(90 - 30); L.theta = deg2rad(35);
  sliderIntensity.value = 2.4; keyLight.intensity = 2.4;
  controls.enabled = true; controls.enableZoom = true;
  controls.reset();
  presetSelect.value = '';
  placeKeyLight();
});

// Resize + render
function resize() {
  const r = stage.getBoundingClientRect();
  renderer.setSize(r.width, r.height);
  camera.aspect = r.width / r.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

function tick() {
  requestAnimationFrame(tick);
  controls.update();
  renderer.render(scene, camera);
}
tick();



