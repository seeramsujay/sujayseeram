/**
 * NarrativeScene — Continuous Story-Driven 3D Canvas
 * Technical Pastel Art Direction & Multi-Model Transitions
 * 1. Hero: Oversized Matte White & Brushed Aluminum ESP32
 * 2. Physical Layer: Procedural FFT Vibration Waveform
 * 3. Logic Layer: Distributed Node Constellation Graph
 * 4. Optimization Layer: Minimalist Edge Device Core & Orbiting Rings
 * 5. Human Element: Volumetric Ambient Particle Field
 */

import * as THREE from 'three';

export class NarrativeScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;
    this.clock = new THREE.Clock();

    // Oil-motion continuous pointer tracking
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0; // 0.0 to 1.0

    // Groups for the narrative layers
    this.heroEspGroup = null;
    this.waveGroup = null;
    this.waveMesh = null;
    this.nodeGraphGroup = null;
    this.optCoreGroup = null;
    this.ambientParticles = null;

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent to allow pastel CSS gradient background

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer with soft clinical lighting
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 4. Studio Lighting Rig (Clean laboratory aesthetic)
    this.setupLighting();

    // 5. Build Layer 1: ESP32 Microcontroller (Hero)
    this.buildEsp32Model();

    // 6. Build Layer 2: FFT Acoustic Waveform (Physical)
    this.buildWaveformModel();

    // 7. Build Layer 3: Distributed Node Graph (Logic)
    this.buildNodeGraphModel();

    // 8. Build Layer 4: Minimalist Edge Device Core (Optimization)
    this.buildOptimizationCore();

    // 9. Build Layer 5: Ambient Particle Field (Human Element)
    this.buildAmbientParticles();

    // 10. Bind Events
    this.bindEvents();

    // 11. Run Render Loop
    this.tick();
  }

  setupLighting() {
    // Soft omni fill
    const ambient = new THREE.AmbientLight(0xffffff, 1.8);
    this.scene.add(ambient);

    // Key Light: Crisp white clinical laboratory light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    this.scene.add(keyLight);

    // Pastel Mint bounce light from lower left
    const mintBounce = new THREE.DirectionalLight(0xe6f4ea, 1.2);
    mintBounce.position.set(-6, -4, 4);
    this.scene.add(mintBounce);

    // Slate Blue rim light from behind
    const blueRim = new THREE.DirectionalLight(0xbfdbfe, 1.4);
    blueRim.position.set(2, -6, -5);
    this.scene.add(blueRim);
  }

  // LAYER 1: Oversized ESP32 (Clay/Matte White & Brushed Aluminum)
  buildEsp32Model() {
    this.heroEspGroup = new THREE.Group();
    this.scene.add(this.heroEspGroup);

    // 1. Matte White Clay Substrate PCB
    const pcbGeo = new THREE.BoxGeometry(4.4, 2.7, 0.14);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbf9, // Pure architectural matte white
      roughness: 0.35,
      metalness: 0.05
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    this.heroEspGroup.add(pcbMesh);

    // 2. Brushed Aluminum RF Shield Can (ESP32-WROOM module)
    const canGeo = new THREE.BoxGeometry(1.8, 1.9, 0.22);
    const canMat = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb, // Brushed silver
      roughness: 0.25,
      metalness: 0.85
    });
    const canMesh = new THREE.Mesh(canGeo, canMat);
    canMesh.position.set(0.8, 0, 0.14);
    this.heroEspGroup.add(canMesh);

    // 3. Meandered Inverted-F PCB Antenna trace (Gold reflective)
    const antGeo = new THREE.BoxGeometry(0.3, 2.2, 0.04);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Polished gold
      roughness: 0.2,
      metalness: 0.95
    });
    const antMesh = new THREE.Mesh(antGeo, goldMat);
    antMesh.position.set(1.9, 0, 0.08);
    this.heroEspGroup.add(antMesh);

    // 4. Silicon USB-UART Bridge IC (Matte Black)
    const icGeo = new THREE.BoxGeometry(0.65, 0.65, 0.1);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.4,
      metalness: 0.1
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.set(-0.7, 0, 0.1);
    this.heroEspGroup.add(icMesh);

    // 5. USB-C Interface (Polished Aluminum)
    const usbGeo = new THREE.BoxGeometry(0.7, 0.55, 0.24);
    const usbMesh = new THREE.Mesh(usbGeo, canMat);
    usbMesh.position.set(-2.2, 0, 0.08);
    this.heroEspGroup.add(usbMesh);

    // 6. Dual Gold Pin Headers (38 pins total)
    for (let i = -1.8; i <= 1.8; i += 0.22) {
      // Top header pin
      const pTop = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), goldMat);
      pTop.rotation.x = Math.PI / 2;
      pTop.position.set(i, 1.22, 0.1);
      this.heroEspGroup.add(pTop);

      // Bottom header pin
      const pBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 12), goldMat);
      pBottom.rotation.x = Math.PI / 2;
      pBottom.position.set(i, -1.22, 0.1);
      this.heroEspGroup.add(pBottom);
    }

    // 7. Micro SMD Capacitors & LED Indicator Diodes
    const smdGeo = new THREE.BoxGeometry(0.12, 0.08, 0.06);
    const smdMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.8, roughness: 0.3 });
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x0f766e }); // Emerald status LED

    for (let k = 0; k < 6; k++) {
      const smd = new THREE.Mesh(smdGeo, smdMat);
      smd.position.set(-1.2 + (k % 3) * 0.25, -0.6 + Math.floor(k / 3) * 0.4, 0.09);
      this.heroEspGroup.add(smd);
    }
    const led = new THREE.Mesh(smdGeo, ledMat);
    led.position.set(-1.4, 0.8, 0.09);
    this.heroEspGroup.add(led);

    // Initial position & tilt
    this.heroEspGroup.position.set(1.4, 0, 0);
    this.heroEspGroup.rotation.set(0.15, -0.35, 0.08);
  }

  // LAYER 2: Acoustic Waveform / FFT Vibration Simulation
  buildWaveformModel() {
    this.waveGroup = new THREE.Group();
    this.scene.add(this.waveGroup);

    const width = 12;
    const height = 5;
    const segW = 60;
    const segH = 28;
    const geo = new THREE.PlaneGeometry(width, height, segW, segH);

    const mat = new THREE.MeshStandardMaterial({
      color: 0x0f766e, // Technical Pastel Mint
      wireframe: true,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85
    });

    this.waveMesh = new THREE.Mesh(geo, mat);
    this.waveMesh.rotation.x = -Math.PI / 2.8;
    this.waveGroup.add(this.waveMesh);

    // Store base vertex positions for wave equation
    this.wavePosAttr = geo.attributes.position;
    this.waveCount = this.wavePosAttr.count;
    this.waveInitialZ = new Float32Array(this.waveCount);
    for (let i = 0; i < this.waveCount; i++) {
      this.waveInitialZ[i] = this.wavePosAttr.getZ(i);
    }

    this.waveGroup.position.set(0, 0, -4);
    this.waveGroup.visible = false;
  }

  // LAYER 3: Distributed Node Graph (Constellation / MCP Network)
  buildNodeGraphModel() {
    this.nodeGraphGroup = new THREE.Group();
    this.scene.add(this.nodeGraphGroup);

    const nodeCount = 45;
    const nodes = [];
    const sphereGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8, // Soft Slate Cobalt
      roughness: 0.2,
      metalness: 0.5,
      emissive: 0x60a5fa,
      emissiveIntensity: 0.3
    });

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4
      );
      this.nodeGraphGroup.add(mesh);
      nodes.push(mesh.position);
    }

    // Connect close neighbors with thin lines
    const linePositions = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 2.4) {
          linePositions.push(nodes[i].x, nodes[i].y, nodes[i].z);
          linePositions.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.4
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    this.nodeGraphGroup.add(lines);

    this.nodeGraphGroup.position.set(0, 0, -5);
    this.nodeGraphGroup.visible = false;
  }

  // LAYER 4: Optimization Layer Core (Minimalist Edge Device Core)
  buildOptimizationCore() {
    this.optCoreGroup = new THREE.Group();
    this.scene.add(this.optCoreGroup);

    // Floating central core
    const coreGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xf3e8fd, // Soft Lavender Clay
      roughness: 0.2,
      metalness: 0.3,
      wireframe: true
    });
    this.optCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.optCoreGroup.add(this.optCoreMesh);

    // 2 Orbiting precision data rings
    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.03, 16, 64);
    const ringGeo2 = new THREE.TorusGeometry(3.0, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7e22ce, transparent: true, opacity: 0.6 });

    this.optRing1 = new THREE.Mesh(ringGeo1, ringMat);
    this.optRing2 = new THREE.Mesh(ringGeo2, ringMat);
    this.optRing1.rotation.x = Math.PI / 3;
    this.optRing2.rotation.y = Math.PI / 4;
    this.optCoreGroup.add(this.optRing1);
    this.optCoreGroup.add(this.optRing2);

    this.optCoreGroup.position.set(0, 0, -6);
    this.optCoreGroup.visible = false;
  }

  // LAYER 5: Volumetric Ambient Particle Field
  buildAmbientParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.06,
      transparent: true,
      opacity: 0.5
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      this.pointer.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.pointer.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this.onResize = () => {
      if (!this.canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  // Driven by GSAP ScrollTrigger / Lenis smooth scroll
  updateScrollProgress(progress) {
    this.scrollProgress = progress; // 0.0 at top to 1.0 at bottom

    // Transitions across 5 Narrative Stages:
    // Stage 1 (Hero): 0.0 -> 0.22
    // Stage 2 (Physical FFT): 0.22 -> 0.44
    // Stage 3 (Logic Node Graph): 0.44 -> 0.66
    // Stage 4 (Optimization Core): 0.66 -> 0.85
    // Stage 5 (Human Element / Archive): 0.85 -> 1.0

    if (this.heroEspGroup) {
      if (progress < 0.25) {
        this.heroEspGroup.visible = true;
        const localT = progress / 0.25;
        this.heroEspGroup.position.set(1.4 - localT * 0.8, -localT * 0.5, -localT * 3);
        this.heroEspGroup.rotation.y = -0.35 + localT * 1.5;
        this.heroEspGroup.scale.setScalar(1 - localT * 0.4);
      } else {
        this.heroEspGroup.visible = false;
      }
    }

    if (this.waveGroup) {
      if (progress >= 0.15 && progress < 0.50) {
        this.waveGroup.visible = true;
        const localT = (progress - 0.15) / 0.35;
        this.waveGroup.position.z = -5 + Math.sin(localT * Math.PI) * 4;
        this.waveGroup.position.y = -0.5 + Math.cos(localT * Math.PI) * 0.5;
      } else {
        this.waveGroup.visible = false;
      }
    }

    if (this.nodeGraphGroup) {
      if (progress >= 0.42 && progress < 0.72) {
        this.nodeGraphGroup.visible = true;
        const localT = (progress - 0.42) / 0.30;
        this.nodeGraphGroup.position.z = -6 + Math.sin(localT * Math.PI) * 4.5;
        this.nodeGraphGroup.rotation.y = localT * Math.PI;
      } else {
        this.nodeGraphGroup.visible = false;
      }
    }

    if (this.optCoreGroup) {
      if (progress >= 0.65 && progress < 0.90) {
        this.optCoreGroup.visible = true;
        const localT = (progress - 0.65) / 0.25;
        this.optCoreGroup.position.z = -6 + Math.sin(localT * Math.PI) * 4.2;
      } else {
        this.optCoreGroup.visible = false;
      }
    }
  }

  tick() {
    this.animId = requestAnimationFrame(() => this.tick());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // 1. Oil-Motion Pointer Damping
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.05;

    // 2. Hero ESP32 Idle & Parallax
    if (this.heroEspGroup && this.heroEspGroup.visible) {
      this.heroEspGroup.rotation.y += 0.003;
      this.heroEspGroup.rotation.x = 0.15 + this.pointer.y * 0.25;
      this.heroEspGroup.rotation.z = 0.08 + this.pointer.x * 0.2;
    }

    // 3. FFT Waveform Vertex Oscillation
    if (this.waveGroup && this.waveGroup.visible && this.waveMesh) {
      const pos = this.waveMesh.geometry.attributes.position;
      for (let i = 0; i < this.waveCount; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        // Harmonic vibration formula: f(x, y, t) = sin(u + t) * cos(v + t)
        const z = Math.sin(u * 1.2 + elapsed * 2.8) * 0.45 +
                  Math.cos(v * 1.8 + elapsed * 2.2) * 0.35 +
                  Math.sin((u + v) * 0.8 + elapsed * 1.5) * 0.2;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
      this.waveGroup.rotation.z = Math.sin(elapsed * 0.4) * 0.05;
    }

    // 4. Node Graph Slow Constellation Rotation
    if (this.nodeGraphGroup && this.nodeGraphGroup.visible) {
      this.nodeGraphGroup.rotation.y += 0.004;
      this.nodeGraphGroup.rotation.x = this.pointer.y * 0.15;
    }

    // 5. Optimization Core & Data Rings
    if (this.optCoreGroup && this.optCoreGroup.visible) {
      this.optCoreMesh.rotation.x += 0.01;
      this.optCoreMesh.rotation.y += 0.012;
      this.optRing1.rotation.z += 0.015;
      this.optRing2.rotation.x += 0.018;
    }

    // 6. Ambient Drift Particles
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = elapsed * 0.015;
    }

    // 7. Render
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
    if (this.renderer) this.renderer.dispose();
  }
}
