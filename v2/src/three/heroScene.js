import * as THREE from 'three';

export function initHeroScene(canvasElement, onFpsUpdate) {
  if (!canvasElement) return;

  // 1. Scene & Camera Setup
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 18);

  // 2. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 3. Dynamic Micro-Geometry Nodes (Small floating 3D shapes)
  const microGroup = new THREE.Group();
  scene.add(microGroup);

  const microShapes = [];
  const geos = [
    new THREE.OctahedronGeometry(0.35),
    new THREE.TetrahedronGeometry(0.4),
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.RingGeometry(0.2, 0.4, 16)
  ];

  const colors = [0x7c3aed, 0x0284c7, 0x059669, 0xdb2777];

  for (let i = 0; i < 36; i++) {
    const geo = geos[i % geos.length];
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i % colors.length],
      wireframe: i % 2 === 0,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.6
    });

    const mesh = new THREE.Mesh(geo, mat);
    const radius = 8 + Math.random() * 12;
    const angle = (i / 36) * Math.PI * 2;
    const y = (Math.random() - 0.5) * 16;

    mesh.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );

    microGroup.add(mesh);
    microShapes.push({
      mesh,
      angle,
      radius,
      speed: 0.15 + Math.random() * 0.3,
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02
    });
  }

  // Particle Constellation Layer
  const particleCount = 400;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x7c3aed,
    size: 0.06,
    transparent: true,
    opacity: 0.35
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Lighting
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(10, 10, 10);
  scene.add(dirLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  // Mouse & Scroll Parallax Listeners
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

  // Animation Loop
  const clock = new THREE.Clock();
  let frameCount = 0;
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate small micro-geometries
    microShapes.forEach(s => {
      s.angle += s.speed * 0.01;
      s.mesh.position.x = Math.cos(s.angle) * s.radius;
      s.mesh.position.z = Math.sin(s.angle) * s.radius;
      s.mesh.rotation.x += s.rotX;
      s.mesh.rotation.y += s.rotY;
    });

    particleSystem.rotation.y = elapsedTime * 0.01;

    // Smooth Lerp Parallax & Scroll Displacement
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 1.5;
    camera.position.y = -targetY * 1.5 - scrollY * 0.003;

    renderer.render(scene, camera);

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

  // Handle Window Resize
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
      geos.forEach(g => g.dispose());
      renderer.dispose();
    }
  };
}
