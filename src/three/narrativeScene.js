/**
 * Three.js Story-Driven WebGL Scene
 * Technical Pastel Palette & Continuous Narrative Arc
 *
 * Stage 1: Oversized ESP32 Microcontroller (Hero - Physical/Clay & Brushed Aluminum)
 * Stage 2: FFT Acoustic Waveform (Physical Layer - Sound & Sensor Processing)
 * Stage 3: Distributed Node Graph (Logic Layer - AI Infrastructure & Constellations)
 * Stage 4: Minimalist Edge Device Core & Orbiting Rings (Optimization Layer)
 * Stage 5: Volumetric Ambient Particle Field (Human Element / Archive)
 */

import * as THREE from 'three';

export class NarrativeScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();

    // Interaction & Scroll State
    this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0; // 0.0 to 1.0

    // Groups for each stage of the narrative
    this.heroEspGroup = null;
    this.waveGroup = null;
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

    // 2. Camera with responsive FOV / distance
    const aspect = window.innerWidth / window.innerHeight;
    const isMobile = window.innerWidth < 768;
    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    this.camera.position.set(0, 0, isMobile ? 9.2 : 7.5);

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

    // 9. Build Layer 5: Volumetric Ambient Particle Field
    this.buildAmbientParticles();

    // 10. Listeners
    this.bindEvents();

    // 11. Initial progress positioning
    this.updateScrollProgress(0);

    // 12. Render loop
    this.tick();
  }

  setupLighting() {
    // Diffuse ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    // Soft key directional light
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.4);
    keyLight.position.set(5, 8, 5);
    this.scene.add(keyLight);

    // Soft cool fill light for clay volume
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.8);
    fillLight.position.set(-6, -2, 4);
    this.scene.add(fillLight);

    // Subtle mint rim light
    const rimLight = new THREE.DirectionalLight(0xd1fae5, 0.6);
    rimLight.position.set(0, -6, -4);
    this.scene.add(rimLight);
  }

  // LAYER 1: Realistic ESP32 Microcontroller Model in Clay / Brushed Aluminum
  buildEsp32Model() {
    this.heroEspGroup = new THREE.Group();
    this.scene.add(this.heroEspGroup);

    // 1. PCB Board (Matte Clay White)
    const pcbGeo = new THREE.BoxGeometry(2.8, 4.8, 0.12);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc, // Off-white clean clay
      roughness: 0.45,
      metalness: 0.05
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    this.heroEspGroup.add(pcbMesh);

    // 2. Metallic RF Shield Can (Brushed Aluminum finish)
    const canGeo = new THREE.BoxGeometry(1.9, 2.0, 0.22);
    const canMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.85
    });
    const canMesh = new THREE.Mesh(canGeo, canMat);
    canMesh.position.set(0, 0.35, 0.14);
    this.heroEspGroup.add(canMesh);

    // 3. Meandered PCB Inverted-F Antenna (Gold/Copper Trace)
    const antGeo = new THREE.BoxGeometry(1.8, 0.9, 0.02);
    const antMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Polished copper
      roughness: 0.3,
      metalness: 0.9
    });
    const antMesh = new THREE.Mesh(antGeo, antMat);
    antMesh.position.set(0, 1.85, 0.07);
    this.heroEspGroup.add(antMesh);

    // 4. USB-C / Micro-USB Port (Metallic Silver)
    const usbGeo = new THREE.BoxGeometry(0.85, 0.65, 0.26);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.2,
      metalness: 0.95
    });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(0, -2.4, 0.08);
    this.heroEspGroup.add(usbMesh);

    // 5. Silicon ICs (CP2102 UART bridge & power regulator)
    const icGeo = new THREE.BoxGeometry(0.55, 0.55, 0.1);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.1
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.set(-0.55, -1.2, 0.09);
    this.heroEspGroup.add(icMesh);

    // 6. Dual Gold Header Pin Rows (Left & Right)
    const pinGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.32, 8);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Gold plating
      roughness: 0.2,
      metalness: 0.95
    });

    const pinRows = 15;
    for (let i = 0; i < pinRows; i++) {
      const yPos = 2.0 - i * 0.28;
      // Left pin
      const leftPin = new THREE.Mesh(pinGeo, pinMat);
      leftPin.rotation.x = Math.PI / 2;
      leftPin.position.set(-1.3, yPos, -0.15);
      this.heroEspGroup.add(leftPin);

      // Right pin
      const rightPin = new THREE.Mesh(pinGeo, pinMat);
      rightPin.rotation.x = Math.PI / 2;
      rightPin.position.set(1.3, yPos, -0.15);
      this.heroEspGroup.add(rightPin);
    }

    // 7. Micro SMD Status LEDs
    const ledGeo = new THREE.BoxGeometry(0.1, 0.06, 0.04);
    const ledPowerMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Mint Green
    const ledBlueMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 }); // Slate Blue

    const pwrLed = new THREE.Mesh(ledGeo, ledPowerMat);
    pwrLed.position.set(0.65, -1.8, 0.08);
    this.heroEspGroup.add(pwrLed);

    const blueLed = new THREE.Mesh(ledGeo, ledBlueMat);
    blueLed.position.set(0.45, -1.8, 0.08);
    this.heroEspGroup.add(blueLed);

    // Position Hero Model initially
    const isMobile = window.innerWidth < 768;
    this.heroEspGroup.position.set(isMobile ? 0 : 1.4, isMobile ? -0.8 : 0, 0);
    this.heroEspGroup.rotation.set(0.2, -0.35, 0.1);
  }

  // LAYER 2: Acoustic FFT 3D Waveform (Physical Layer)
  buildWaveformModel() {
    this.waveGroup = new THREE.Group();
    this.scene.add(this.waveGroup);

    const width = 8;
    const height = 5;
    const segmentsX = 40;
    const segmentsY = 25;

    const waveGeo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
    const waveMat = new THREE.MeshStandardMaterial({
      color: 0x10b981, // Mint wireframe
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      roughness: 0.3
    });

    this.waveMesh = new THREE.Mesh(waveGeo, waveMat);
    this.waveMesh.rotation.x = -Math.PI / 2.8;
    this.waveGroup.add(this.waveMesh);

    this.waveCount = waveGeo.attributes.position.count;
    this.waveGroup.position.set(0, -0.5, -4);
    this.waveGroup.visible = false;
  }

  // LAYER 3: Distributed Constellation Node Graph (Logic Layer)
  buildNodeGraphModel() {
    this.nodeGraphGroup = new THREE.Group();
    this.scene.add(this.nodeGraphGroup);

    const nodeCount = 36;
    const nodes = [];
    const sphereGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Slate Blue
      emissive: 0x3b82f6,
      emissiveIntensity: 0.4,
      roughness: 0.2
    });

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      const radius = 2.8;
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      mesh.position.set(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      this.nodeGraphGroup.add(mesh);
      nodes.push(mesh.position);
    }

    // Connect close nodes with lines
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

    this.onTouchMove = (e) => {
      if (e.touches && e.touches.length > 0) {
        this.pointer.targetX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.pointer.targetY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    this.onResize = () => {
      if (!this.canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = w < 768;

      this.camera.aspect = w / h;
      this.camera.position.set(0, 0, isMobile ? 9.2 : 7.5);
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(w, h);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.updateScrollProgress(this.scrollProgress);
    };

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
  }

  // Driven by GSAP ScrollTrigger / Lenis smooth scroll
  updateScrollProgress(progress) {
    this.scrollProgress = progress; // 0.0 at top to 1.0 at bottom
    const isMobile = window.innerWidth < 768;

    // Stage 1 (Hero): 0.0 -> 0.25
    if (this.heroEspGroup) {
      if (progress < 0.25) {
        this.heroEspGroup.visible = true;
        const localT = progress / 0.25;
        const heroX = isMobile ? 0 : 1.4;
        const heroY = isMobile ? -0.8 : 0;
        const heroScale = isMobile ? 0.72 : 1.0;

        this.heroEspGroup.position.set(
          heroX - localT * (isMobile ? 0.2 : 0.8),
          heroY - localT * 0.5,
          -localT * 3
        );
        this.heroEspGroup.rotation.y = -0.35 + localT * 1.5;
        this.heroEspGroup.scale.setScalar(heroScale * (1 - localT * 0.4));
      } else {
        this.heroEspGroup.visible = false;
      }
    }

    // Stage 2 (Physical FFT Waveform): 0.15 -> 0.50
    if (this.waveGroup) {
      if (progress >= 0.15 && progress < 0.50) {
        this.waveGroup.visible = true;
        const localT = (progress - 0.15) / 0.35;
        this.waveGroup.position.z = -5 + Math.sin(localT * Math.PI) * 4;
        this.waveGroup.position.y = (isMobile ? -0.7 : -0.5) + Math.cos(localT * Math.PI) * 0.5;
        this.waveGroup.scale.setScalar(isMobile ? 0.72 : 1.0);
      } else {
        this.waveGroup.visible = false;
      }
    }

    // Stage 3 (Logic Node Graph): 0.42 -> 0.72
    if (this.nodeGraphGroup) {
      if (progress >= 0.42 && progress < 0.72) {
        this.nodeGraphGroup.visible = true;
        const localT = (progress - 0.42) / 0.30;
        this.nodeGraphGroup.position.z = -6 + Math.sin(localT * Math.PI) * 4.5;
        this.nodeGraphGroup.position.y = isMobile ? -0.6 : 0;
        this.nodeGraphGroup.scale.setScalar(isMobile ? 0.7 : 1.0);
        this.nodeGraphGroup.rotation.y = localT * Math.PI;
      } else {
        this.nodeGraphGroup.visible = false;
      }
    }

    // Stage 4 (Optimization Core): 0.65 -> 0.90
    if (this.optCoreGroup) {
      if (progress >= 0.65 && progress < 0.90) {
        this.optCoreGroup.visible = true;
        const localT = (progress - 0.65) / 0.25;
        this.optCoreGroup.position.z = -6 + Math.sin(localT * Math.PI) * 4.2;
        this.optCoreGroup.position.y = isMobile ? -0.6 : 0;
        this.optCoreGroup.scale.setScalar(isMobile ? 0.7 : 1.0);
      } else {
        this.optCoreGroup.visible = false;
      }
    }
  }

  tick() {
    this.animId = requestAnimationFrame(() => this.tick());

    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // 1. Pointer Damping (Oil-Motion spring physics)
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

    // 6. Volumetric Particles Ambient Drift
    if (this.ambientParticles) {
      this.ambientParticles.rotation.y = elapsed * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
