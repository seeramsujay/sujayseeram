/**
 * Master Application Entry Point for Sujay Seeram Portfolio V2
 * Natural Architectural Studio & Horizontal Stage Exhibition
 */

import { StudioScene } from './three/studioScene.js';
import { ProjectModal } from './components/modal.js';
import { ProjectShowcase } from './components/showcase.js';
import { StageNavigator } from './components/stageNavigator.js';
import { synth } from './audio/synth.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Natural Physical Studio Scene
  const canvasEl = document.getElementById('studio-canvas');
  let studioScene = null;
  if (canvasEl) {
    try {
      studioScene = new StudioScene(canvasEl);
    } catch (e) {
      console.warn('Three.js / WebGL fallback:', e);
    }
  }

  // 2. Initialize Project Markdown Dossier Drawer
  const projectModal = new ProjectModal();

  // 3. Initialize Exhibition & Engineering Archive
  const showcase = new ProjectShowcase(projectModal);

  // 4. Initialize Horizontal Stage Navigator & Oil-Motion Cursor Tracker
  const stageNavigator = new StageNavigator(studioScene);

  // 5. Live Telemetry Clock (IST)
  const clockEl = document.getElementById('live-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    clockEl.innerHTML = `<span>${timeStr} IST</span>`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 6. Audio Feedback HUD Toggle
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxText = document.getElementById('sfx-text');

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      const isMuted = synth.toggleMute();
      if (sfxIcon) sfxIcon.textContent = isMuted ? '🔇' : '🔊';
      if (sfxText) sfxText.textContent = isMuted ? 'SFX: OFF' : 'SFX: ON';
      if (!isMuted) synth.playTick(600);
    });
  }

  // 7. Email Quick Copy Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      synth.playSuccess();
      navigator.clipboard.writeText('sujayat2007@gmail.com').then(() => {
        const orig = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `<span>Copied ✔</span>`;
        setTimeout(() => {
          copyEmailBtn.innerHTML = orig;
        }, 2200);
      });
    });
  }

  // 8. Direct Dispatch Transmission Form
  const dispatchForm = document.getElementById('dispatch-form');
  const dispatchBtn = document.getElementById('dispatch-btn');

  if (dispatchForm && dispatchBtn) {
    dispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      synth.playChirp(720);

      const origText = dispatchBtn.innerHTML;
      dispatchBtn.disabled = true;
      dispatchBtn.innerHTML = `<span>Dispatching...</span>`;

      setTimeout(() => {
        synth.playSuccess();
        dispatchBtn.innerHTML = `<span>Message Dispatched ✔</span>`;
        dispatchForm.reset();

        setTimeout(() => {
          dispatchBtn.disabled = false;
          dispatchBtn.innerHTML = origText;
        }, 3000);
      }, 1000);
    });
  }

  console.log('⚡ Sujay Seeram Architectural Studio V2 Initialized.');
});
