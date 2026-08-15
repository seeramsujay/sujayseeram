// Procedural Crystal Growth & Scroll-Driven Project Block Three.js Engine for Sujay Seeram V2
import * as THREE from 'three';

export function initHeroScene(canvasElement, onFpsUpdate) {
  if (!canvasElement) return;

  // 1. Scene & Camera Setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xdfe5eb, 0.016);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 16);

  // 2. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3. Procedural Crystal Growth Noise Displacer
  function createProceduralSiliconCrystal(width, height, depth, seed) {
    const geo = new THREE.BoxGeometry(width, height, depth, 18, 18, 18);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);

      const noise1 = Math.sin(vx * 1.3 + seed) * Math.cos(vy * 1.4 + seed) * 0.48;
      const noise2 = Math.cos(vz * 1.6 + seed * 2.1) * Math.sin(vy * 0.8) * 0.38;
      const facet = Math.abs(vx * vy * vz) > 1.2 ? Math.sin(seed + vx) * 0.55 : 0;

      pos.setXYZ(i, vx + noise1 + facet, vy + noise2, vz + noise1 * 0.45);
    }

    geo.computeVertexNormals();
    return geo;
  }

  // 4. Project Data for Sequential 3D Ice / Silicon Blocks
  const projectBlocksData = [
    { title: "SLINGSHOT", tag: "PORTFOLIO_CO_01 // LUNAR DUST", seed: 1.5, yPos: 0 },
    { title: "EVOLVAI", tag: "PORTFOLIO_CO_02 // PHYSICS VAE", seed: 4.2, yPos: -12 },
    { title: "SPECRAG", tag: "PORTFOLIO_CO_03 // FIRMWARE RAG", seed: 8.1, yPos: -24 },
    { title: "SMARTRING", tag: "PORTFOLIO_CO_04 // ESP32 I2C", seed: 12.6, yPos: -36 },
    { title: "MOTORSAFE", tag: "PORTFOLIO_CO_05 // TRL-4 DSP", seed: 16.8, yPos: -48 }
  ];

  const crystalGroup = new THREE.Group();
  scene.add(crystalGroup);

  // Positioned on center-right (`x: +5.5`) to allow 100% text readability on the left
  crystalGroup.position.set(5.5, 0, 0);

  const projectCrystals = [];

  projectBlocksData.forEach((p, idx) => {
    const geo = createProceduralSiliconCrystal(3.4, 4.6, 2.4, p.seed);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.12,
      metalness: 0.88,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, p.yPos, 0);
    crystalGroup.add(mesh);

    // Inner glowing wireframe core
    const wireGeo = new THREE.IcosahedronGeometry(2.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.38
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mesh.add(wireMesh);

    projectCrystals.push({ mesh, wireMesh, data: p });
  });

  // 5. Swirling Atmospheric Particle Swarm
  const particleCount = 650;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const c1 = new THREE.Color(0x38bdf8);
  const c2 = new THREE.Color(0x7c3aed);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 35;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const pCol = c1.clone().lerp(c2, Math.random());
    colors[i * 3] = pCol.r;
    colors[i * 3 + 1] = pCol.g;
    colors[i * 3 + 2] = pCol.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.45
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // 6. Lights
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
  dirLight1.position.set(12, 15, 12);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.8);
  dirLight2.position.set(-10, -10, 5);
  scene.add(dirLight2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  // 7. Mouse & Scroll Parallax Listeners
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
    updateLeaderLinePositions();
  });

  // 8. 3D World to 2D HTML Leader Line Projection
  function updateLeaderLinePositions() {
    const callout = document.getElementById('leader-callout');
    if (!callout || projectCrystals.length === 0) return;

    // Find active block based on scroll depth
    const blockIndex = Math.min(
      Math.floor(scrollY / 600),
      projectCrystals.length - 1
    );
    const activeObj = projectCrystals[blockIndex];
    if (!activeObj) return;

    const vector = new THREE.Vector3();
    activeObj.mesh.getWorldPosition(vector);
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-(vector.y * 0.5) + 0.5) * window.innerHeight;

    callout.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    const textSpan = callout.querySelector('span');
    if (textSpan) {
      textSpan.textContent = `${activeObj.data.tag} // CLICK TO EXPLORE`;
    }
  }

  // 9. Animation & Camera Scroll Kinematics Loop
  const clock = new THREE.Clock();
  let frameCount = 0;
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate active crystals
    projectCrystals.forEach((c, idx) => {
      c.mesh.rotation.y = elapsedTime * (0.15 + idx * 0.02);
      c.mesh.rotation.x = Math.sin(elapsedTime * 0.5 + idx) * 0.1;
      c.wireMesh.rotation.y = -elapsedTime * 0.2;
    });

    particleSystem.rotation.y = elapsedTime * 0.015;

    // Smooth Lerp Mouse Parallax & Camera Scroll Down the Project Landscape
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 1.2;
    camera.position.y = -targetY * 1.2 - (scrollY * 0.012);

    // Responsive 3D position adjustment
    if (window.innerWidth < 900) {
      crystalGroup.position.set(0, 3, -4);
    } else {
      crystalGroup.position.set(5.5, 0, 0);
    }

    renderer.render(scene, camera);

    updateLeaderLinePositions();

    // FPS Meter
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (onFpsUpdate) onFpsUpdate(frameCount);
      frameCount = 0;
      lastTime = now;
    }
  }

  animate();

  // 10. Handle Window Resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize);

  return {
    dispose: () => {
      window.removeEventListener('resize', onWindowResize);
      projectCrystals.forEach(c => {
        c.mesh.geometry.dispose();
        c.mesh.material.dispose();
        c.wireMesh.geometry.dispose();
        c.wireMesh.material.dispose();
      });
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    }
  };
}
