/**
 * Master Application Entry Point for Sujay Seeram Portfolio V2
 */

import { CyberScene } from './three/cyberScene.js';
import { ProjectModal } from './components/modal.js';
import { CyberTerminal } from './components/terminal.js';
import { ProjectShowcase } from './components/showcase.js';
import { synth } from './audio/synth.js';
import { activeProjects, allProjects } from './data/projectsData.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Cybernetic Visuals
  const canvasEl = document.getElementById('hero-canvas');
  let cyberScene = null;
  if (canvasEl) {
    try {
      cyberScene = new CyberScene(canvasEl);
    } catch (e) {
      console.warn('WebGL / Three.js initialization fallback:', e);
    }
  }

  // 2. Initialize Project Markdown Dossier Modal
  const projectModal = new ProjectModal();

  // 3. Initialize Interactive Cyber Terminal CLI
  const terminal = new CyberTerminal(projectModal);

  // 4. Initialize Odyssey Showcase Matrix & Vault
  const showcase = new ProjectShowcase(projectModal, cyberScene);

  // 5. Update Metrics Counter
  const activeCountEl = document.getElementById('active-count-metric');
  const totalCountEl = document.getElementById('total-count-metric');
  if (activeCountEl) activeCountEl.textContent = `${activeProjects.length}+`;
  if (totalCountEl) totalCountEl.textContent = `${allProjects.length}`;

  // 6. Live Telemetry Clock (IST)
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
    clockEl.textContent = `${timeStr} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 7. Audio SFX HUD Toggle
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-status-icon');
  const sfxText = document.getElementById('sfx-status-text');

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      const isMuted = synth.toggleMute();
      if (sfxIcon) sfxIcon.textContent = isMuted ? '🔇' : '🔊';
      if (sfxText) sfxText.textContent = isMuted ? 'SFX: OFF' : 'SFX: ON';
      if (!isMuted) synth.playTick();
    });
  }

  // 8. Email Quick Copy Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      synth.playSuccess();
      navigator.clipboard.writeText('sujayat2007@gmail.com').then(() => {
        const orig = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = `<span>COPIED ✔</span>`;
        setTimeout(() => {
          copyEmailBtn.innerHTML = orig;
        }, 2200);
      });
    });
  }

  // 9. Interactive Transmit Form Simulation
  const form = document.getElementById('transmit-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      synth.playChirp(880);

      const origBtn = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>DISPATCHING PACKETS...</span>`;

      setTimeout(() => {
        synth.playSuccess();
        submitBtn.innerHTML = `<span>TRANSMISSION CONFIRMED ✔</span>`;
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origBtn;
        }, 3000);
      }, 1200);
    });
  }

  // 10. Nav Links Smooth Active Highlight
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  console.log('⚡ Sujay Seeram Sovereign Architecture V2 Initialized.');
});
