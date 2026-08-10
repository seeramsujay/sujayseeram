import * as THREE from 'three';

export function initHeroScene(canvasElement, onFpsUpdate) {
  if (!canvasElement) return;

  // 1. Scene & Camera Setup (Clean Light Scene)
  const scene = new THREE.Scene();
  scene.background = null; // Transparent to allow CSS pristine white backdrop

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 16);

  // 2. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  // 3. Custom GLSL Shader Material for Iridescent 3D Morphing Fluid Mesh
  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    // Simplex 3D Noise function
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vNormal = normal;
      vPosition = position;

      float displacement = snoise(position * 0.8 + vec3(uTime * 0.5)) * 0.8;
      displacement += snoise(position * 1.5 - vec3(uTime * 0.3)) * 0.4;
      vDisplacement = displacement;

      vec3 newPosition = position + normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;

    void main() {
      // Iridescent gradient computation (Cyan -> Purple -> Pink -> Amber)
      vec3 colorA = vec3(0.0, 0.9, 1.0);  // Bright Cyan
      vec3 colorB = vec3(0.5, 0.0, 1.0);  // Vivid Purple
      vec3 colorC = vec3(1.0, 0.0, 0.5);  // Electric Magenta

      float mixFactor = sin(vDisplacement * 2.5 + uTime * 0.8) * 0.5 + 0.5;
      vec3 baseColor = mix(colorA, colorB, mixFactor);
      baseColor = mix(baseColor, colorC, sin(uTime + vPosition.x) * 0.5 + 0.5);

      // Fresnal Rim Light
      vec3 viewDir = normalize(vPosition);
      float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);

      vec3 finalColor = mix(baseColor, vec3(1.0), fresnel * 0.6);

      gl_FragColor = vec4(finalColor, 0.85);
    }
  `;

  const morphGeo = new THREE.IcosahedronGeometry(4.2, 64);
  const morphMat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    },
    wireframe: false,
    transparent: true,
    side: THREE.DoubleSide
  });

  const morphMesh = new THREE.Mesh(morphGeo, morphMat);
  morphMesh.position.set(6, 0, 0); // Positioned to right of hero text
  scene.add(morphMesh);

  // Wireframe outer cage
  const cageGeo = new THREE.IcosahedronGeometry(5.2, 3);
  const cageMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  const cageMesh = new THREE.Mesh(cageGeo, cageMat);
  cageMesh.position.copy(morphMesh.position);
  scene.add(cageMesh);

  // 4. Orbiting Floating 3D Polyhedron Nodes
  const nodeCount = 18;
  const nodeGroup = new THREE.Group();
  const nodes = [];

  const geos = [
    new THREE.OctahedronGeometry(0.5),
    new THREE.TetrahedronGeometry(0.6),
    new THREE.DodecahedronGeometry(0.4)
  ];
  const nodeMat = new THREE.MeshStandardMaterial({
    color: 0x7c3aed,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x2563eb,
    emissiveIntensity: 0.3
  });

  for (let i = 0; i < nodeCount; i++) {
    const mesh = new THREE.Mesh(geos[i % geos.length], nodeMat);
    const radius = 6 + Math.random() * 6;
    const angle = (i / nodeCount) * Math.PI * 2;
    const y = (Math.random() - 0.5) * 8;

    mesh.position.set(
      morphMesh.position.x + Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius
    );

    nodeGroup.add(mesh);
    nodes.push({ mesh, radius, angle, y, speed: 0.2 + Math.random() * 0.4 });
  }
  scene.add(nodeGroup);

  // 5. Lighting Setup
  const dirLight1 = new THREE.DirectionalLight(0xffffff, 2);
  dirLight1.position.set(10, 10, 10);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x00e5ff, 1.5);
  dirLight2.position.set(-10, -10, 5);
  scene.add(dirLight2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));

  // 6. Interactive Parallax & Mouse Controls
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

  // 7. Animation Loop
  const clock = new THREE.Clock();
  let frameCount = 0;
  let lastTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Update GLSL shader time uniform
    morphMat.uniforms.uTime.value = elapsedTime;
    morphMat.uniforms.uMouse.value.set(targetX, targetY);

    // Rotate meshes
    morphMesh.rotation.y = elapsedTime * 0.15;
    morphMesh.rotation.x = elapsedTime * 0.1;

    cageMesh.rotation.y = -elapsedTime * 0.1;
    cageMesh.rotation.z = elapsedTime * 0.05;

    // Animate orbiting nodes
    nodes.forEach(n => {
      n.angle += n.speed * 0.01;
      n.mesh.position.x = morphMesh.position.x + Math.cos(n.angle) * n.radius;
      n.mesh.position.z = Math.sin(n.angle) * n.radius;
      n.mesh.rotation.x += 0.02;
      n.mesh.rotation.y += 0.02;
    });

    // Smooth Lerp Mouse Parallax
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    morphMesh.position.x = 6 + targetX * 1.5;
    morphMesh.position.y = -targetY * 1.5 - scrollY * 0.004;
    cageMesh.position.copy(morphMesh.position);

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

  // 8. Handle Resize
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjust 3D mesh position for small screens
    if (window.innerWidth < 900) {
      morphMesh.position.set(0, 2, -2);
    } else {
      morphMesh.position.set(6, 0, 0);
    }
  }

  window.addEventListener('resize', onWindowResize);
  onWindowResize();

  return {
    dispose: () => {
      window.removeEventListener('resize', onWindowResize);
      morphGeo.dispose();
      morphMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      renderer.dispose();
    }
  };
}
