// Main Entry Point for Sujay Seeram Portfolio V2
import './styles/main.css';
import { initPreloader } from './components/preloader.js';
import { initHeroScene } from './three/heroScene.js';
import { initTimeline } from './components/timeline.js';
import { initProjectsMatrix } from './components/projects.js';
import { initTerminal } from './components/terminal.js';
import { toggleSFX, playClickSFX, playHoverSFX } from './audio/soundEngine.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Igloo Build Preloader
  initPreloader(() => {
    // 2. Initialize Three.js Icy Monolith Scene after build complete
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
      initHeroScene(heroCanvas);
    }
  });

  // 3. Initialize Chronological Timeline (V1 Odyssey)
  initTimeline();

  // 4. Initialize Vault Projects Grid (V1 Repositories)
  initProjectsMatrix();

  // 5. Initialize CLI Terminal Drawer
  initTerminal();

  // 6. Setup Audio SFX Toggle
  const sfxToggleBtn = document.getElementById('sfx-toggle');
  if (sfxToggleBtn) {
    sfxToggleBtn.addEventListener('click', () => {
      const enabled = toggleSFX();
      const label = sfxToggleBtn.querySelector('.hud-label');
      if (label) {
        label.textContent = enabled ? '🔈 Sound: ON' : '🔇 Sound: OFF';
      }
      playClickSFX();
    });
  }

  // 7. Setup Form Dispatch Simulation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      playClickSFX();

      const btn = contactForm.querySelector('button[type="submit"] span');
      if (btn) {
        btn.textContent = 'TRANSMISSION DISPATCHED ✔';
        setTimeout(() => {
          btn.textContent = 'DISPATCH TRANSMISSION';
          contactForm.reset();
        }, 3000);
      }
    });
  }

  // 8. Attach Sound Events to Interactive Elements
  attachSoundEvents();
});

function attachSoundEvents() {
  const clickables = document.querySelectorAll('a, button, input[type="submit"]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => playHoverSFX());
    el.addEventListener('click', () => playClickSFX());
  });
}
