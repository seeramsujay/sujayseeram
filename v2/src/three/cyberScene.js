/**
 * Sovereign Cyber-Physical Three.js Scene Engine
 * Adheres to: oil-motion guidelines (continuous damping, pointer scrubbing, reduced-motion fallback)
 * Three.js Best Practices: DPR clamping, resource cleanup, frame-budget-conscious RAF loop.
 */

import * as THREE from 'three';
import { synth } from '../audio/synth.js';

export class CyberScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;
    this.clock = new THREE.Clock();

    // Interaction & Motion tracking
    this.targetMouse = { x: 0, y: 0 };
    this.currentMouse = { x: 0, y: 0 };
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.isHoveringCore = false;

    // Responsive position anchor (Right on desktop, centered behind on mobile)
    this.coreBaseX = window.innerWidth > 960 ? 3.6 : 0;
    this.coreBaseY = 0;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Raycasting
    this.raycaster = new THREE.Raycaster();
    this.mouseNDC = new THREE.Vector2(-999, -999);

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030508, 0.025);

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 11);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 4. Lighting - Cybernetic Dual-Tone
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    this.scene.add(ambientLight);

    // Mint Key Light
    this.keyLight = new THREE.PointLight(0x00f5a0, 4.0, 30);
    this.keyLight.position.set(5, 6, 8);
    this.scene.add(this.keyLight);

    // Cyan Fill Light
    this.fillLight = new THREE.PointLight(0x00d2ff, 3.5, 30);
    this.fillLight.position.set(-6, -4, 6);
    this.scene.add(this.fillLight);

    // Electric Violet Rim Light
    this.rimLight = new THREE.DirectionalLight(0xb537f2, 2.0);
    this.rimLight.position.set(0, 8, -6);
    this.scene.add(this.rimLight);

    // 5. Build Procedural Gyroscopic Core
    this.buildCore();

    // 6. Build Ambient Particle Lattice
    this.buildParticles();

    // 7. Event Listeners with Damped Tracking
    this.bindEvents();

    // 8. Start Render Loop
    this.tick();
  }

  buildCore() {
    this.coreGroup = new THREE.Group();
    this.coreGroup.position.set(this.coreBaseX, this.coreBaseY, 0);
    this.scene.add(this.coreGroup);

    // Outer Gyro Wireframe (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(2.3, 1);
    this.outerMat = new THREE.MeshStandardMaterial({
      color: 0x00f5a0,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.9
    });
    this.outerMesh = new THREE.Mesh(outerGeo, this.outerMat);
    this.coreGroup.add(this.outerMesh);

    // Middle Faceted Silicon Monolith (Dodecahedron)
    const midGeo = new THREE.DodecahedronGeometry(1.6, 0);
    this.midMat = new THREE.MeshStandardMaterial({
      color: 0x07111e,
      roughness: 0.15,
      metalness: 0.95,
      flatShading: true,
      transparent: true,
      opacity: 0.92
    });
    this.midMesh = new THREE.Mesh(midGeo, this.midMat);
    this.coreGroup.add(this.midMesh);

    // Inner Glowing Quantum Heart (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(0.85, 0);
    this.innerMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      emissive: 0x00f5a0,
      emissiveIntensity: 0.6,
      wireframe: false,
      roughness: 0.2,
      metalness: 0.8
    });
    this.innerMesh = new THREE.Mesh(innerGeo, this.innerMat);
    this.coreGroup.add(this.innerMesh);

    // Gimbal Ring 1 (Yaw Axis)
    const ring1Geo = new THREE.TorusGeometry(3.3, 0.022, 16, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.45
    });
    this.ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    this.ring1.rotation.x = Math.PI / 3;
    this.coreGroup.add(this.ring1);

    // Gimbal Ring 2 (Pitch Axis)
    const ring2Geo = new THREE.TorusGeometry(3.9, 0.018, 16, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xb537f2,
      transparent: true,
      opacity: 0.35
    });
    this.ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    this.ring2.rotation.y = Math.PI / 4;
    this.coreGroup.add(this.ring2);

    // Gimbal Ring 3 (Outer Boundary)
    const ring3Geo = new THREE.TorusGeometry(4.5, 0.014, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x00f5a0,
      transparent: true,
      opacity: 0.25
    });
    this.ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    this.coreGroup.add(this.ring3);

    // Orbiting Satellite Sensor Beacons
    this.satellites = [];
    const satCount = 4;
    for (let i = 0; i < satCount; i++) {
      const satGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00f5a0 : 0x00d2ff
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      this.coreGroup.add(satMesh);
      this.satellites.push({
        mesh: satMesh,
        radius: 3.3 + (i * 0.4),
        speed: (i + 1) * 0.4 * (i % 2 === 0 ? 1 : -1),
        phase: (i * Math.PI) / 2
      });
    }

    // Interactive target array for Raycasting
    this.interactables = [this.outerMesh, this.midMesh, this.innerMesh];
  }

  buildParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cMint = new THREE.Color(0x00f5a0);
    const cCyan = new THREE.Color(0x00d2ff);
    const cViolet = new THREE.Color(0xb537f2);

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical / toroidal cloud distribution around core
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.0 + Math.random() * 16.0;
      const height = (Math.random() - 0.5) * 26.0;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12.0;

      // Color interpolation
      const rand = Math.random();
      let pColor;
      if (rand < 0.45) {
        pColor = cMint.clone().lerp(cCyan, Math.random());
      } else if (rand < 0.85) {
        pColor = cCyan.clone().lerp(cViolet, Math.random());
      } else {
        pColor = cViolet;
      }

      colors[i * 3] = pColor.r;
      colors[i * 3 + 1] = pColor.g;
      colors[i * 3 + 2] = pColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particleField = new THREE.Points(geometry, material);
    this.scene.add(this.particleField);
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      // Normalizing pointer between -1 and 1
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this.onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      this.targetScrollProgress = window.scrollY / maxScroll;
    };

    this.onResize = () => {
      if (!this.canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Dynamic repositioning based on viewport width
      this.coreBaseX = width > 960 ? 3.6 : 0;
    };

    this.onVisibilityChange = () => {
      if (document.hidden) {
        this.clock.stop();
      } else {
        this.clock.start();
      }
    };

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  tick() {
    this.animId = requestAnimationFrame(() => this.tick());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Damped Lerp for Pointer and Scroll (oil-motion driver)
    const pointerDamp = this.isReducedMotion ? 0.02 : 0.055;
    this.currentMouse.x += (this.targetMouse.x - this.currentMouse.x) * pointerDamp;
    this.currentMouse.y += (this.targetMouse.y - this.currentMouse.y) * pointerDamp;

    const scrollDamp = 0.08;
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * scrollDamp;

    // 2. Animate Core Transformations
    if (this.coreGroup) {
      // Base rotation + pointer reactive tilt
      const speedMult = this.isReducedMotion ? 0.2 : 1.0;
      this.outerMesh.rotation.x = elapsed * 0.25 * speedMult;
      this.outerMesh.rotation.y = elapsed * 0.35 * speedMult;

      this.midMesh.rotation.x = -elapsed * 0.3 * speedMult;
      this.midMesh.rotation.z = elapsed * 0.2 * speedMult;

      this.innerMesh.rotation.y = elapsed * 0.6 * speedMult;

      // Gimbal Rings
      this.ring1.rotation.z = elapsed * 0.15 * speedMult;
      this.ring2.rotation.x = -elapsed * 0.18 * speedMult;
      this.ring3.rotation.y = elapsed * 0.12 * speedMult;

      // Orbiting Sensor Satellites
      this.satellites.forEach((sat) => {
        const theta = sat.phase + elapsed * sat.speed * speedMult;
        sat.mesh.position.x = Math.cos(theta) * sat.radius;
        sat.mesh.position.y = Math.sin(theta * 0.8) * (sat.radius * 0.4);
        sat.mesh.position.z = Math.sin(theta) * (sat.radius * 0.8);
      });

      // Pointer Parallax
      const targetPosX = this.coreBaseX + this.currentMouse.x * 0.75;
      const targetPosY = this.coreBaseY + this.currentMouse.y * 0.5 - this.scrollProgress * 2.5;
      this.coreGroup.position.x += (targetPosX - this.coreGroup.position.x) * 0.06;
      this.coreGroup.position.y += (targetPosY - this.coreGroup.position.y) * 0.06;

      // Dynamic Scale Pulse
      const breath = 1.0 + Math.sin(elapsed * 1.5) * 0.035;
      this.coreGroup.scale.set(breath, breath, breath);
    }

    // 3. Particle Field Drift
    if (this.particleField) {
      this.particleField.rotation.y = elapsed * 0.03;
      this.particleField.position.y = -this.scrollProgress * 8.0;
    }

    // 4. Raycaster Hover Check
    if (this.camera && !this.isReducedMotion) {
      this.raycaster.setFromCamera(this.mouseNDC, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactables);

      if (intersects.length > 0) {
        if (!this.isHoveringCore) {
          this.isHoveringCore = true;
          this.outerMat.color.setHex(0x7ee7ff);
          this.outerMat.opacity = 0.85;
          this.innerMat.emissiveIntensity = 1.4;
          synth.playTick();
        }
      } else {
        if (this.isHoveringCore) {
          this.isHoveringCore = false;
          this.outerMat.color.setHex(0x00f5a0);
          this.outerMat.opacity = 0.45;
          this.innerMat.emissiveIntensity = 0.6;
        }
      }
    }

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  // Set visual focus towards a specific category/state
  setThemeMood(category) {
    if (!this.keyLight || !this.fillLight) return;
    switch (category) {
      case 'hardware':
        this.keyLight.color.setHex(0xffb800); // Solar Amber
        this.fillLight.color.setHex(0x00f5a0); // Mint
        break;
      case 'research':
      case 'physics':
        this.keyLight.color.setHex(0x00d2ff); // Quantum Cyan
        this.fillLight.color.setHex(0xb537f2); // Electric Violet
        break;
      case 'hackathon':
        this.keyLight.color.setHex(0xb537f2); // Electric Violet
        this.fillLight.color.setHex(0xffb800); // Amber
        break;
      default:
        this.keyLight.color.setHex(0x00f5a0); // Mint
        this.fillLight.color.setHex(0x00d2ff); // Cyan
        break;
    }
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.scene) {
      this.scene.clear();
    }
  }
}
