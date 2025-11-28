import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URL = '/assets/modelo/cuerpo.glb';

const DOM_DELTA_LINE = 1;
const DOM_DELTA_PAGE = 2;

const CAMERA_MIN_DISTANCE = 0.75;
const CAMERA_MAX_DISTANCE = 8.5;
const CAMERA_WHEEL_SPEED = 0.0011;
const CAMERA_WHEEL_FINE = 0.35;

const deg2rad = (d) => (d * Math.PI) / 180;
const rad2deg = (r) => (r * 180) / Math.PI;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function initModule1({
  stage,
  toggleLightButton,
  presetSelect,
  intensitySlider,
  resetButton,
  captureButton,
}) {
  if (!stage) {
    console.warn('initModule1: missing stage element');
    return () => { };
  }

  const disposer = [];
  const track = (fn) => {
    disposer.push(fn);
    return fn;
  };
  const addListener = (target, evt, handler, options) => {
    if (!target) return;
    target.addEventListener(evt, handler, options);
    track(() => target.removeEventListener(evt, handler, options));
  };

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25)); // Reduced for performance
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer, cheaper look
  stage.appendChild(renderer.domElement);
  track(() => renderer.domElement.remove());

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0d12);

  const camera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 100);
  camera.position.set(2.6, 1.6, 3.2);
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.9;
  controls.minDistance = CAMERA_MIN_DISTANCE;
  controls.maxDistance = CAMERA_MAX_DISTANCE;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0x141923, roughness: 0.95 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.35);
  scene.add(hemi);

  const rim = new THREE.DirectionalLight(0xffffff, 0.45);
  rim.position.set(-2.2, 1.6, -1.8);
  scene.add(rim);

  const keyLight = new THREE.SpotLight(0xffffff, 2.4, 0, deg2rad(28), 0.25, 1.8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(512, 512); // Optimized shadow map
  keyLight.shadow.bias = -0.00008;
  scene.add(keyLight);
  scene.add(keyLight.target);

  const SHOW_LIGHT_GIZMO = true;
  const bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd382 }),
  );
  bulb.layers.set(1); // Gizmo en capa aparte para ocultarlo en la captura
  if (SHOW_LIGHT_GIZMO) {
    scene.add(bulb);
    camera.layers.enable(1); // Mostrar el gizmo durante la interacción
  }

  const spherical = new THREE.Spherical(2.4, deg2rad(90 - 30), deg2rad(35));
  const R_MIN = 1.2;
  const R_MAX = 6.0;
  const PHI_MIN = deg2rad(0.5);
  const PHI_MAX = Math.PI / 2 - deg2rad(0.5);
  let targetY = 1.0;

  function placeKeyLight() {
    spherical.radius = clamp(spherical.radius, R_MIN, R_MAX);
    spherical.phi = clamp(spherical.phi, PHI_MIN, PHI_MAX);
    const pos = new THREE.Vector3().setFromSpherical(spherical);
    keyLight.position.copy(pos);
    keyLight.target.position.set(0, targetY, 0);
    if (SHOW_LIGHT_GIZMO) bulb.position.copy(pos);

    // Emitir evento para el sistema de misiones
    window.dispatchEvent(new CustomEvent('mission:update-3d', {
      detail: {
        theta: spherical.theta,
        phi: spherical.phi,
        intensity: keyLight.intensity
      }
    }));
  }
  placeKeyLight();

  if (intensitySlider) {
    addListener(intensitySlider, 'input', () => {
      keyLight.intensity = parseFloat(intensitySlider.value);
    });
  }

  const zoomVector = new THREE.Vector3();
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

  const loader = new GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.isMesh) obj.castShadow = true;
      });

      const box1 = new THREE.Box3().setFromObject(model);
      const size1 = new THREE.Vector3();
      box1.getSize(size1);
      const scale = 1.8 / size1.y;
      model.scale.setScalar(scale);

      const box2 = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box2.getCenter(center);
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= box2.min.y;

      box2.setFromObject(model);
      const size2 = new THREE.Vector3();
      box2.getSize(size2);
      targetY = box2.min.y + size2.y * 0.55;
      placeKeyLight();

      controls.target.set(0, targetY, 0);
      controls.update();
      controls.saveState?.();

      scene.add(model);
    },
    undefined,
    (error) => {
      console.warn('No se pudo cargar el modelo 3D:', error);
    },
  );

  let movingLight = false;
  const drag = { active: false, x: 0, y: 0, theta0: 0, phi0: 0 };

  const updateToggleButton = () => {
    if (!toggleLightButton) return;
    toggleLightButton.textContent = `Mover luz con el mouse: ${movingLight ? 'ON' : 'OFF'}`;

    if (movingLight) {
      // Active state (ON)
      toggleLightButton.classList.add('bg-yellow-500', 'text-black', 'border-yellow-500');
      toggleLightButton.classList.remove('text-yellow-500', 'border-yellow-500/50');
    } else {
      // Inactive state (OFF)
      toggleLightButton.classList.remove('bg-yellow-500', 'text-black', 'border-yellow-500');
      toggleLightButton.classList.add('text-yellow-500', 'border-yellow-500/50');
    }
  };
  updateToggleButton();

  addListener(toggleLightButton, 'click', () => {
    movingLight = !movingLight;
    controls.enabled = !movingLight;
    controls.enableZoom = !movingLight;
    updateToggleButton();
  });

  const handlePointerDown = (event) => {
    if (!movingLight) return;
    drag.active = true;
    drag.x = event.clientX;
    drag.y = event.clientY;
    drag.theta0 = spherical.theta;
    drag.phi0 = spherical.phi;
  };

  const handlePointerMove = (event) => {
    if (!drag.active) return;
    const fine = event.shiftKey ? 0.003 : 0.01;
    const dx = (event.clientX - drag.x) * fine;
    const dy = (event.clientY - drag.y) * fine;

    if (event.ctrlKey) {
      spherical.phi = drag.phi0 + dy;
    } else if (event.altKey) {
      spherical.theta = drag.theta0 + dx;
    } else {
      spherical.theta = drag.theta0 + dx;
      spherical.phi = drag.phi0 + dy;
    }
    placeKeyLight();
  };

  const stopDrag = () => {
    drag.active = false;
  };

  addListener(renderer.domElement, 'pointerdown', handlePointerDown);
  addListener(window, 'pointermove', handlePointerMove);
  addListener(window, 'pointerup', stopDrag);

  const handleWheel = (event) => {
    const delta = normalizeWheelDelta(event);
    if (movingLight) {
      event.preventDefault();
      const k = event.shiftKey ? 0.003 : 0.01;
      spherical.radius = clamp(spherical.radius + delta * k, R_MIN, R_MAX);
      placeKeyLight();
      event.stopPropagation();
      return;
    }
    if (!controls.enableZoom) return;
    event.preventDefault();
    applyCameraZoom(delta, event.shiftKey);
    event.stopPropagation();
  };
  renderer.domElement.addEventListener('wheel', handleWheel, { passive: false, capture: true });
  track(() => renderer.domElement.removeEventListener('wheel', handleWheel, { capture: true }));

  const applyPreset = (name) => {
    const elev = (deg) => {
      spherical.phi = deg2rad(90 - deg);
    };
    switch (name) {
      case 'cenital':
        elev(70);
        spherical.theta = deg2rad(45);
        spherical.radius = 2.6;
        break;
      case 'contrapicada':
        elev(5);
        spherical.theta = deg2rad(0);
        spherical.radius = 2.2;
        break;
      case 'perfil_izq':
        elev(20);
        spherical.theta = deg2rad(270);
        spherical.radius = 2.4;
        break;
      case 'perfil_der':
        elev(20);
        spherical.theta = deg2rad(90);
        spherical.radius = 2.4;
        break;
      default:
        return;
    }
    placeKeyLight();
  };

  addListener(presetSelect, 'change', (event) => applyPreset(event.target.value));

  addListener(resetButton, 'click', () => {
    spherical.radius = 2.4;
    spherical.phi = deg2rad(90 - 30);
    spherical.theta = deg2rad(35);
    if (intensitySlider) {
      intensitySlider.value = '2.4';
      keyLight.intensity = 2.4;
    }
    controls.enabled = true;
    controls.enableZoom = true;
    controls.reset();
    if (presetSelect) presetSelect.value = '';
    movingLight = false;
    updateToggleButton();
    placeKeyLight();
  });

  addListener(captureButton, 'click', () => {
    if (!captureButton) return;
    const originalLabel = captureButton.textContent;
    captureButton.disabled = true;
    captureButton.textContent = 'Capturando...';
    const prevBulbVisibility = bulb.visible;
    const bulbParent = bulb.parent;
    const bulbLayerEnabled = SHOW_LIGHT_GIZMO ? camera.layers.test(bulb.layers) : false;
    try {
      if (SHOW_LIGHT_GIZMO && bulbParent) bulbParent.remove(bulb);
      if (SHOW_LIGHT_GIZMO) {
        bulb.visible = false; // Ocultamos el gizmo de la luz en la foto
        camera.layers.disable(1); // No renderizar la capa del gizmo
      }
      renderer.clear(true, true, true); // Evitamos restos del frame anterior
      renderer.render(scene, camera);
      const dataUrl = renderer.domElement.toDataURL('image/png');
      window.dispatchEvent(
        new CustomEvent('module1:snapshot', {
          detail: {
            dataUrl,
            width: renderer.domElement.width,
            height: renderer.domElement.height,
          },
        }),
      );
    } catch (error) {
      console.error('Error al capturar la escena 3D', error);
      alert('No se pudo tomar la foto del modelo 3D. Intenta de nuevo.');
    } finally {
      if (bulbLayerEnabled) camera.layers.enable(1);
      if (SHOW_LIGHT_GIZMO && bulbParent && !bulbParent.children.includes(bulb)) {
        bulbParent.add(bulb);
      }
      bulb.visible = prevBulbVisibility;
      captureButton.disabled = false;
      captureButton.textContent = originalLabel || 'Capturar foto 3D';
    }
  });

  const resize = () => {
    const rect = stage.getBoundingClientRect();
    const width = rect.width || stage.clientWidth || 1;
    const height = rect.height || width * (9 / 16);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  addListener(window, 'resize', resize);
  resize();

  let frameId;
  let isVisible = true;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
    },
    { threshold: 0 }
  );
  observer.observe(renderer.domElement);
  track(() => observer.disconnect());

  const tick = () => {
    frameId = requestAnimationFrame(tick);
    if (isVisible) {
      controls.update();
      renderer.render(scene, camera);
    }
  };
  tick();

  return () => {
    cancelAnimationFrame(frameId);
    disposer.reverse().forEach((fn) => {
      try {
        fn?.();
      } catch (err) {
        console.warn('cleanup error', err);
      }
    });
    controls.dispose();
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.geometry?.dispose?.();
        const mat = obj.material;
        if (Array.isArray(mat)) {
          mat.forEach((m) => m?.dispose?.());
        } else {
          mat?.dispose?.();
        }
      }
    });
  };
}
