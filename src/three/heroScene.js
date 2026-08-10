import * as THREE from 'three';

export function initHeroScene(canvasElement, onFpsUpdate) {
  if (!canvasElement) return;

  // 1. Scene & Camera setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0c12, 0.025);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 20);

  // 2. Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3. Subtle 3D Constellation & Particle Mesh
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorCyan = new THREE.Color(0x00f3ff);
  const colorBlue = new THREE.Color(0x3b82f6);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

    const mix = Math.random();
    const pColor = colorCyan.clone().lerp(colorBlue, mix);
    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.45
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Wireframe Background Grid Planes
  const gridGeo = new THREE.PlaneGeometry(60, 60, 24, 24);
  const gridMat = new THREE.MeshBasicMaterial({
    color: 0x1e293b,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const gridMesh = new THREE.Mesh(gridGeo, gridMat);
  gridMesh.rotation.x = -Math.PI / 2.5;
  gridMesh.position.y = -8;
  scene.add(gridMesh);

  // 4. Mouse Parallax & Scroll Listeners
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // 5. Animation Loop
  const clock = new THREE.Clock();
  let frameCount = 0;
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Gentle ambient rotation
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = elapsedTime * 0.01;

    // Smooth Lerp Parallax
    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    camera.position.x = targetX * 1.5;
    camera.position.y = -targetY * 1.5 - scrollY * 0.003;

    renderer.render(scene, camera);

    // FPS Counter
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (onFpsUpdate) onFpsUpdate(frameCount);
      frameCount = 0;
      lastTime = now;
    }
  }

  animate();

  // 6. Handle Resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);

  return {
    dispose: () => {
      window.removeEventListener('resize', onWindowResize);
      particleGeo.dispose();
      particleMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      renderer.dispose();
    }
  };
}
