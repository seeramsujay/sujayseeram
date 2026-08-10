import * as THREE from 'three';
import { playFaultAlarmSFX } from '../audio/soundEngine.js';

export function initPhysicsSandbox(canvasElement) {
  if (!canvasElement) return;

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvasElement.clientWidth / canvasElement.clientHeight, 0.1, 100);
  camera.position.set(0, 4, 14);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true, alpha: true });
  renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Grid Floor
  const gridHelper = new THREE.GridHelper(20, 20, 0x00f3ff, 0x112233);
  gridHelper.position.y = -2;
  scene.add(gridHelper);

  // 2. 3D Waveform Ribbon Geometry (100 segments)
  const segmentCount = 120;
  const positions = new Float32Array(segmentCount * 3);
  const colors = new Float32Array(segmentCount * 3);

  const cyanColor = new THREE.Color(0x00f3ff);
  const redColor = new THREE.Color(0xff0055);

  for (let i = 0; i < segmentCount; i++) {
    positions[i * 3] = (i - segmentCount / 2) * 0.15;
    positions[i * 3 + 1] = 0;
    positions[i * 3 + 2] = 0;

    colors[i * 3] = cyanColor.r;
    colors[i * 3 + 1] = cyanColor.g;
    colors[i * 3 + 2] = cyanColor.b;
  }

  const waveGeo = new THREE.BufferGeometry();
  waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  waveGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const waveMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    linewidth: 3
  });

  const waveLine = new THREE.Line(waveGeo, waveMat);
  scene.add(waveLine);

  // 3. Motor Rotor 3D Representation
  const rotorGeo = new THREE.CylinderGeometry(1.5, 1.5, 3, 32);
  const rotorMat = new THREE.MeshStandardMaterial({
    color: 0x8000ff,
    wireframe: true,
    roughness: 0.1
  });
  const rotorMesh = new THREE.Mesh(rotorGeo, rotorMat);
  rotorMesh.rotation.z = Math.PI / 2;
  rotorMesh.position.set(-6, 0, 0);
  scene.add(rotorMesh);

  // Lights
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  // Simulation Parameters
  let params = {
    freq: 50,
    load: 25,
    vibration: 0.05,
    damping: 0.85,
    faultTriggered: false
  };

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate Motor Rotor according to frequency
    const speed = (params.freq / 50) * 0.2;
    rotorMesh.rotation.x += speed;

    // Update 3D Waveform signal positions
    const posAttr = waveGeo.attributes.position;
    const colAttr = waveGeo.attributes.color;

    const baseAmp = (params.load / 100) * 1.2;
    const vibAmp = params.faultTriggered ? 2.5 : params.vibration * 3.0;

    for (let i = 0; i < segmentCount; i++) {
      const x = (i - segmentCount / 2) * 0.15;
      const fundamental = Math.sin(x * 0.5 + elapsedTime * (params.freq * 0.1)) * baseAmp;
      const harmonicNoise = Math.sin(x * 2.5 + elapsedTime * 12) * vibAmp;
      
      const y = fundamental + harmonicNoise;

      posAttr.setY(i, y);

      // Color shift if fault
      if (params.faultTriggered || vibAmp > 1.0) {
        colAttr.setXYZ(i, redColor.r, redColor.g, redColor.b);
      } else {
        colAttr.setXYZ(i, cyanColor.r, cyanColor.g, cyanColor.b);
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();

  // Attach DOM Listeners for sliders
  const sliderFreq = document.getElementById('slider-freq');
  const sliderLoad = document.getElementById('slider-load');
  const sliderVib = document.getElementById('slider-vibration');
  const sliderDamping = document.getElementById('slider-damping');
  const faultBtn = document.getElementById('trigger-fault-btn');

  function updateMetricsDisplay() {
    const freqVal = document.getElementById('val-freq');
    const loadVal = document.getElementById('val-load');
    const vibVal = document.getElementById('val-vibration');
    const dampingVal = document.getElementById('val-damping');

    if (freqVal) freqVal.textContent = `${params.freq} Hz`;
    if (loadVal) loadVal.textContent = `${params.load}%`;
    if (vibVal) vibVal.textContent = params.vibration.toFixed(2);
    if (dampingVal) dampingVal.textContent = params.damping.toFixed(2);

    const rms = (params.vibration * 1.8 + (params.load / 100) * 0.4).toFixed(2);
    const anomaly = (params.faultTriggered ? 0.94 : params.vibration * 0.85).toFixed(2);

    const rmsEl = document.getElementById('metric-rms');
    const anomalyEl = document.getElementById('metric-anomaly');
    const relayEl = document.getElementById('metric-relay');
    const statusBadge = document.getElementById('sim-status');
    const freqBadge = document.getElementById('sim-freq-display');

    if (rmsEl) rmsEl.textContent = `${rms} g`;
    if (anomalyEl) anomalyEl.textContent = anomaly;
    if (freqBadge) freqBadge.textContent = `${params.freq}.0 Hz`;

    if (params.faultTriggered || parseFloat(anomaly) > 0.6) {
      if (relayEl) { relayEl.textContent = 'TRIPPED (OPEN)'; relayEl.className = 'metric-val text-crimson'; }
      if (statusBadge) { statusBadge.textContent = 'CRITICAL FAULT DETECTED'; statusBadge.className = 'status-badge critical'; }
    } else {
      if (relayEl) { relayEl.textContent = 'CLOSED'; relayEl.className = 'metric-val text-green'; }
      if (statusBadge) { statusBadge.textContent = 'HEALTHY (BASELINE)'; statusBadge.className = 'status-badge'; }
    }
  }

  if (sliderFreq) sliderFreq.addEventListener('input', (e) => { params.freq = parseFloat(e.target.value); updateMetricsDisplay(); });
  if (sliderLoad) sliderLoad.addEventListener('input', (e) => { params.load = parseFloat(e.target.value); updateMetricsDisplay(); });
  if (sliderVib) sliderVib.addEventListener('input', (e) => { params.vibration = parseFloat(e.target.value); updateMetricsDisplay(); });
  if (sliderDamping) sliderDamping.addEventListener('input', (e) => { params.damping = parseFloat(e.target.value); updateMetricsDisplay(); });

  if (faultBtn) {
    faultBtn.addEventListener('click', () => {
      params.faultTriggered = !params.faultTriggered;
      if (params.faultTriggered) {
        playFaultAlarmSFX();
        faultBtn.querySelector('span').textContent = 'RESET SYSTEM SAFETY RELAY';
      } else {
        faultBtn.querySelector('span').textContent = 'SIMULATE CATASTROPHIC BEARING FAULT';
      }
      updateMetricsDisplay();
    });
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!canvasElement.clientWidth || !canvasElement.clientHeight) return;
    camera.aspect = canvasElement.clientWidth / canvasElement.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
  });
}
