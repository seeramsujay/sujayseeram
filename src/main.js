// Main Entry Point for Sujay Seeram Portfolio V2
import './styles/main.css';
import { initHeroScene } from './three/heroScene.js';
import { initTimeline } from './components/timeline.js';
import { initProjectsMatrix } from './components/projects.js';
import { initTerminal } from './components/terminal.js';
import { toggleSFX, playClickSFX, playHoverSFX } from './audio/soundEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js Ambient Constellation Scene
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    initHeroScene(heroCanvas);
  }

  // 2. Initialize Chronological Timeline
  initTimeline();

  // 3. Initialize Projects Matrix & Category Filters
  initProjectsMatrix();

  // 4. Initialize CLI Terminal Drawer
  initTerminal();

  // 5. Setup Audio SFX Toggle
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      const enabled = toggleSFX();
      const label = sfxToggleBtn.querySelector('.hud-label');
      if (label) {
        label.textContent = enabled ? 'SFX: ON' : 'SFX: OFF';
      }
      playClickSFX();
    });
  }

  // 6. Setup Form Dispatch Simulation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playClickSFX();

      const btn = contactForm.querySelector('button[type="submit"] span');
      if (btn) {
        btn.textContent = 'TRANSMISSION DISPATCHED ✔';
        setTimeout(() => {
          btn.textContent = 'SEND TRANSMISSION';
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // 7. Attach Sound Events to Interactive Elements
  attachSoundEvents();
});

function attachSoundEvents() {
  const clickables = document.querySelectorAll('a, button, input[type="submit"]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSFX());
    el.addEventListener('click', () => playClickSFX());
  });
}
