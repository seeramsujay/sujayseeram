/**
 * StudioScene — Natural Physical Workbench 3D Scene
 * Built with Three.js according to oil-motion principles:
 * - Real tangible physical objects (Microcontroller PCB, Caliper, Drafting Pen, Notebook)
 * - Natural morning daylight lighting with soft shadows
 * - Smooth camera navigation transitions between pages
 * - Damped cursor tracking for micro-parallax
 */

import * as THREE from 'three';

export class StudioScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animId = null;
    this.clock = new THREE.Clock();

    // Oil-motion continuous pointer tracking
    this.targetPointer = { x: 0, y: 0 };
    this.currentPointer = { x: 0, y: 0 };
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Camera Page Waypoints
    this.cameraWaypoints = {
      0: { pos: new THREE.Vector3(2.8, 3.8, 5.5), target: new THREE.Vector3(0.5, 0.2, 0) },    // Page 1: Overview
      1: { pos: new THREE.Vector3(0.8, 1.8, 3.2), target: new THREE.Vector3(0.2, 0.1, -0.2) },  // Page 2: Macro Chip Inspection
      2: { pos: new THREE.Vector3(0.0, 6.2, 1.2), target: new THREE.Vector3(0.0, 0.0, 0.0) },   // Page 3: Top-Down Drafting Blueprint
      3: { pos: new THREE.Vector3(-2.2, 3.2, 4.5), target: new THREE.Vector3(-0.6, 0.1, 0.2) }  // Page 4: Correspondence Angle
    };

    this.activePageIndex = 0;
    this.cameraCurrentPos = new THREE.Vector3(2.8, 3.8, 5.5);
    this.cameraTargetPos = new THREE.Vector3(2.8, 3.8, 5.5);
    this.lookCurrentTarget = new THREE.Vector3(0.5, 0.2, 0);
    this.lookTarget = new THREE.Vector3(0.5, 0.2, 0);

    this.init();
  }

  init() {
    if (!this.canvas) return;

    // 1. Scene setup (natural daylight atmosphere)
    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent to show natural surface background

    // 2. Camera setup
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 50);
    this.camera.position.copy(this.cameraCurrentPos);
    this.camera.lookAt(this.lookCurrentTarget);

    // 3. Renderer with soft shadows and high color fidelity
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    // 4. Natural Lighting Rig
    this.setupLighting();

    // 5. Construct Real Tangible Physical Objects
    this.buildPhysicalObjects();

    // 6. Bind Interactions & Resize
    this.bindEvents();

    // 7. Start Render Loop
    this.tick();
  }

  setupLighting() {
    // Soft skylight ambient fill
    const hemiLight = new THREE.HemisphereLight(0xfcfaf7, 0xe2ded4, 1.2);
    this.scene.add(hemiLight);

    // Main Sunlight Key (warm morning window light from high left)
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.4);
    sunLight.position.set(6, 9, 5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Soft architectural bounce light
    const bounceLight = new THREE.DirectionalLight(0xd4e2f5, 0.6);
    bounceLight.position.set(-6, 4, -3);
    this.scene.add(bounceLight);
  }

  buildPhysicalObjects() {
    this.workbenchGroup = new THREE.Group();
    this.scene.add(this.workbenchGroup);

    // Tabletop Plane with soft shadow reception
    const tableGeo = new THREE.PlaneGeometry(30, 30);
    const tableMat = new THREE.ShadowMaterial({
      opacity: 0.12
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.rotation.x = -Math.PI / 2;
    tableMesh.position.y = -0.02;
    tableMesh.receiveShadow = true;
    this.scene.add(tableMesh);

    // -------------------------------------------------------------
    // OBJECT 1: REALISTIC MICROCONTROLLER PCB (The Physical Hardware)
    // -------------------------------------------------------------
    this.pcbGroup = new THREE.Group();
    this.pcbGroup.position.set(0.6, 0.06, 0.2);
    this.pcbGroup.rotation.y = -0.15;
    this.workbenchGroup.add(this.pcbGroup);

    // PCB Substrate Board (Matte Forest Green Soldermask)
    const pcbBoardGeo = new THREE.BoxGeometry(3.6, 0.1, 2.5);
    const pcbBoardMat = new THREE.MeshStandardMaterial({
      color: 0x1a472a, // Deep PCB emerald green
      roughness: 0.38,
      metalness: 0.05
    });
    const pcbBoard = new THREE.Mesh(pcbBoardGeo, pcbBoardMat);
    pcbBoard.castShadow = true;
    pcbBoard.receiveShadow = true;
    this.pcbGroup.add(pcbBoard);

    // Copper Ground Plane / Silkscreen Accent on Board
    const silkGeo = new THREE.PlaneGeometry(3.3, 2.2);
    const silkMat = new THREE.MeshStandardMaterial({
      color: 0xc8963e, // Warm copper / gold trace
      roughness: 0.25,
      metalness: 0.85
    });
    const silkMesh = new THREE.Mesh(silkGeo, silkMat);
    silkMesh.rotation.x = -Math.PI / 2;
    silkMesh.position.y = 0.052;
    this.pcbGroup.add(silkMesh);

    // Central IC Microcontroller QFP Package
    const icGeo = new THREE.BoxGeometry(0.95, 0.12, 0.95);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x1e2024, // Matte black silicon epoxy
      roughness: 0.3,
      metalness: 0.1
    });
    const icMesh = new THREE.Mesh(icGeo, icMat);
    icMesh.position.set(-0.2, 0.11, 0);
    icMesh.castShadow = true;
    this.pcbGroup.add(icMesh);

    // IC Pins (Silver metallic leads along borders)
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xd4d8de,
      metalness: 0.9,
      roughness: 0.2
    });
    for (let i = -0.4; i <= 0.4; i += 0.12) {
      // East & West pins
      const pinEast = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), pinMat);
      pinEast.position.set(0.35, 0.08, i);
      this.pcbGroup.add(pinEast);

      const pinWest = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), pinMat);
      pinWest.position.set(-0.75, 0.08, i);
      this.pcbGroup.add(pinWest);

      // North & South pins
      const pinNorth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.18), pinMat);
      pinNorth.position.set(-0.2 + i, 0.08, 0.55);
      this.pcbGroup.add(pinNorth);

      const pinSouth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.18), pinMat);
      pinSouth.position.set(-0.2 + i, 0.08, -0.55);
      this.pcbGroup.add(pinSouth);
    }

    // USB-C Connector (Brushed Stainless Steel)
    const usbGeo = new THREE.BoxGeometry(0.7, 0.24, 0.65);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0xbfc4cb,
      metalness: 0.85,
      roughness: 0.25
    });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(-1.6, 0.14, 0);
    usbMesh.castShadow = true;
    this.pcbGroup.add(usbMesh);

    // Quartz Crystal Resonator (Cylinder)
    const crystalGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.45, 16);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xd0d5dd,
      metalness: 0.95,
      roughness: 0.15
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalMesh.rotation.z = Math.PI / 2;
    crystalMesh.position.set(0.65, 0.12, -0.5);
    crystalMesh.castShadow = true;
    this.pcbGroup.add(crystalMesh);

    // Tactile Buttons (Reset & Boot)
    const btnBaseGeo = new THREE.BoxGeometry(0.3, 0.14, 0.3);
    const btnBaseMat = new THREE.MeshStandardMaterial({ color: 0x22242a, roughness: 0.5 });
    const btnCapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.08, 16);
    const btnCapMat = new THREE.MeshStandardMaterial({ color: 0xc8963e, metalness: 0.8, roughness: 0.3 });

    [-0.8, -0.8].forEach((z, idx) => {
      const bBase = new THREE.Mesh(btnBaseGeo, btnBaseMat);
      const bCap = new THREE.Mesh(btnCapGeo, btnCapMat);
      bBase.position.set(1.2, 0.11, idx === 0 ? -0.7 : 0.7);
      bCap.position.set(1.2, 0.2, idx === 0 ? -0.7 : 0.7);
      this.pcbGroup.add(bBase);
      this.pcbGroup.add(bCap);
    });

    // Dual Header Pin Rows (Female Socket Headers)
    const headerGeo = new THREE.BoxGeometry(3.0, 0.32, 0.2);
    const headerMat = new THREE.MeshStandardMaterial({
      color: 0x14161a,
      roughness: 0.6
    });
    const headerTop = new THREE.Mesh(headerGeo, headerMat);
    headerTop.position.set(-0.1, 0.2, 1.05);
    headerTop.castShadow = true;
    this.pcbGroup.add(headerTop);

    const headerBottom = new THREE.Mesh(headerGeo, headerMat);
    headerBottom.position.set(-0.1, 0.2, -1.05);
    headerBottom.castShadow = true;
    this.pcbGroup.add(headerBottom);

    // -------------------------------------------------------------
    // OBJECT 2: PRECISION MECHANICAL CALIPER (Brass & Steel Measurement)
    // -------------------------------------------------------------
    this.caliperGroup = new THREE.Group();
    this.caliperGroup.position.set(0.8, 0.08, -2.1);
    this.caliperGroup.rotation.y = 0.28;
    this.workbenchGroup.add(this.caliperGroup);

    // Main Caliper Beam Ruler
    const beamGeo = new THREE.BoxGeometry(4.2, 0.08, 0.4);
    const beamMat = new THREE.MeshStandardMaterial({
      color: 0xd9b360, // Solid precision brass
      metalness: 0.85,
      roughness: 0.28
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.castShadow = true;
    this.caliperGroup.add(beamMesh);

    // Fixed Measuring Jaw
    const fixedJawGeo = new THREE.BoxGeometry(0.3, 0.08, 1.2);
    const fixedJaw = new THREE.Mesh(fixedJawGeo, beamMat);
    fixedJaw.position.set(-1.95, 0, 0.6);
    fixedJaw.castShadow = true;
    this.caliperGroup.add(fixedJaw);

    // Sliding Vernier Jaw
    const slidingJawGeo = new THREE.BoxGeometry(0.4, 0.12, 1.2);
    const slidingJaw = new THREE.Mesh(slidingJawGeo, beamMat);
    slidingJaw.position.set(-0.8, 0.02, 0.6);
    slidingJaw.castShadow = true;
    this.caliperGroup.add(slidingJaw);

    // Thumb adjustment knurled wheel
    const thumbGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 24);
    const thumbMat = new THREE.MeshStandardMaterial({ color: 0x9e7b28, metalness: 0.9, roughness: 0.2 });
    const thumbMesh = new THREE.Mesh(thumbGeo, thumbMat);
    thumbMesh.rotation.x = Math.PI / 2;
    thumbMesh.position.set(-0.7, 0.08, -0.15);
    this.caliperGroup.add(thumbMesh);

    // -------------------------------------------------------------
    // OBJECT 3: DRAFTING PEN / MECHANICAL TECHNICAL STYLUS
    // -------------------------------------------------------------
    this.penGroup = new THREE.Group();
    this.penGroup.position.set(-1.8, 0.08, 0.9);
    this.penGroup.rotation.y = -0.55;
    this.workbenchGroup.add(this.penGroup);

    // Pen Body (Brushed Matte Titanium)
    const penBodyGeo = new THREE.CylinderGeometry(0.08, 0.08, 3.2, 24);
    const penBodyMat = new THREE.MeshStandardMaterial({
      color: 0xd0d5dc,
      metalness: 0.8,
      roughness: 0.3
    });
    const penBody = new THREE.Mesh(penBodyGeo, penBodyMat);
    penBody.rotation.z = Math.PI / 2;
    penBody.castShadow = true;
    this.penGroup.add(penBody);

    // Knurled Grip Section
    const gripGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.8, 24);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0x9aa2af,
      metalness: 0.9,
      roughness: 0.4
    });
    const gripMesh = new THREE.Mesh(gripGeo, gripMat);
    gripMesh.rotation.z = Math.PI / 2;
    gripMesh.position.x = 1.0;
    this.penGroup.add(gripMesh);

    // Tapered Drawing Cone & Nib
    const coneGeo = new THREE.ConeGeometry(0.08, 0.35, 24);
    const coneMesh = new THREE.Mesh(coneGeo, penBodyMat);
    coneMesh.rotation.z = -Math.PI / 2;
    coneMesh.position.x = 1.55;
    this.penGroup.add(coneMesh);

    // Pocket Clip
    const clipGeo = new THREE.BoxGeometry(0.9, 0.03, 0.06);
    const clipMesh = new THREE.Mesh(clipGeo, penBodyMat);
    clipMesh.position.set(-1.0, 0.12, 0);
    this.penGroup.add(clipMesh);

    // -------------------------------------------------------------
    // OBJECT 4: ARCHITECTURAL TECHNICAL NOTEBOOK / DOSSIER
    // -------------------------------------------------------------
    this.notebookGroup = new THREE.Group();
    this.notebookGroup.position.set(-2.2, 0.07, -1.2);
    this.notebookGroup.rotation.y = 0.12;
    this.workbenchGroup.add(this.notebookGroup);

    // Notebook Cover (Matte Linen Warm Gray)
    const coverGeo = new THREE.BoxGeometry(2.8, 0.14, 3.8);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0xded8cc, // Warm linen stone
      roughness: 0.75,
      metalness: 0.02
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.castShadow = true;
    coverMesh.receiveShadow = true;
    this.notebookGroup.add(coverMesh);

    // Notebook Paper Edges (Crisp Off-White)
    const paperGeo = new THREE.BoxGeometry(2.68, 0.11, 3.65);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.9,
      metalness: 0.0
    });
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.position.set(0.04, 0.015, 0);
    this.notebookGroup.add(paperMesh);

    // Subtle Ribbon Bookmark (Emerald Silk Accent)
    const ribbonGeo = new THREE.BoxGeometry(0.12, 0.03, 1.4);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x1e5a32,
      roughness: 0.4
    });
    const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbonMesh.position.set(-0.2, 0.08, 1.8);
    ribbonMesh.rotation.y = 0.15;
    this.notebookGroup.add(ribbonMesh);
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      this.targetPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    this.onResize = () => {
      if (!this.canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    this.onVisibilityChange = () => {
      if (document.hidden) {
        this.clock.stop();
      } else {
        this.clock.start();
      }
    };

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  // Smoothly glide camera to match the active page
  setPage(pageIndex) {
    this.activePageIndex = Math.max(0, Math.min(3, pageIndex));
    const wp = this.cameraWaypoints[this.activePageIndex] || this.cameraWaypoints[0];
    this.cameraTargetPos.copy(wp.pos);
    this.lookTarget.copy(wp.target);
  }

  tick() {
    this.animId = requestAnimationFrame(() => this.tick());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Oil-Motion continuous pointer damping
    const damp = this.isReducedMotion ? 0.015 : 0.045;
    this.currentPointer.x += (this.targetPointer.x - this.currentPointer.x) * damp;
    this.currentPointer.y += (this.targetPointer.y - this.currentPointer.y) * damp;

    // 2. Smooth Camera Navigation Lerp
    const camLerp = this.isReducedMotion ? 0.1 : 0.04;
    this.cameraCurrentPos.lerp(this.cameraTargetPos, camLerp);
    this.lookCurrentTarget.lerp(this.lookTarget, camLerp);

    // 3. Pointer Parallax Drift applied to camera
    const parallaxX = this.currentPointer.x * 0.35;
    const parallaxY = this.currentPointer.y * 0.25;

    this.camera.position.set(
      this.cameraCurrentPos.x + parallaxX,
      this.cameraCurrentPos.y + parallaxY,
      this.cameraCurrentPos.z
    );
    this.camera.lookAt(this.lookCurrentTarget);

    // 4. Subtle physical resting micro-motion for objects
    if (this.pcbGroup && !this.isReducedMotion) {
      // Gentle micro-tilt reacting to pointer
      this.pcbGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.015 + this.currentPointer.x * 0.025;
      this.pcbGroup.rotation.x = this.currentPointer.y * 0.02;
    }

    if (this.caliperGroup && !this.isReducedMotion) {
      this.caliperGroup.rotation.z = Math.cos(elapsed * 0.7) * 0.01;
    }

    // 5. Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animId) cancelAnimationFrame(this.animId);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
