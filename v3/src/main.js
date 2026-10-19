/**
 * Master Application Entry Point for Sujay Seeram Portfolio V2
 * Technical Pastel Art Direction with Smooth Inertia Scroll (Lenis + GSAP)
 */

import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { NarrativeScene } from './three/narrativeScene.js';
import { ProjectModal } from './components/modal.js';
import { ProjectShowcase } from './components/showcase.js';
import { synth } from './audio/synth.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Fixed 3D Story-Driven WebGL Scene
  const canvasEl = document.getElementById('narrative-canvas');
  let narrativeScene = null;
  if (canvasEl) {
    try {
      narrativeScene = new NarrativeScene(canvasEl);
    } catch (e) {
      console.warn('Three.js / WebGL fallback:', e);
    }
  }

  // 2. Initialize Project Dossier Slide-Over Drawer
  const projectModal = new ProjectModal();

  // 3. Initialize Complete 76 Archive & Feature Triggers
  const showcase = new ProjectShowcase(projectModal);

  // 4. Initialize Lenis Smooth Inertia Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 5. Connect Scroll to 3D Scene & Pastel Background Transitions
  const sections = [
    { id: 'hero', color: '#FAFAFA' },
    { id: 'physical', color: '#E6F4EA' },
    { id: 'logic', color: '#E8F0FE' },
    { id: 'optimization', color: '#F3E8FD' },
    { id: 'human', color: '#FEF7E0' },
    { id: 'archive', color: '#FAFAFA' },
    { id: 'connect', color: '#FAFAFA' }
  ];

  window.addEventListener('scroll', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

    // Feed progress into 3D scene
    if (narrativeScene) {
      narrativeScene.updateScrollProgress(progress);
    }

    // Dynamic background pastel color transitions
    const scrollMid = window.scrollY + window.innerHeight * 0.45;
    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollMid >= top && scrollMid < top + height) {
          document.documentElement.style.backgroundColor = sec.color;
          break;
        }
      }
    }
  }, { passive: true });

  // 6. Live Telemetry Clock (IST)
  const clockEl = document.getElementById('live-ist-clock');
  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    clockEl.textContent = `${timeStr} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 7. Audio Feedback Toggle
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  const sfxIcon = document.getElementById('sfx-icon');
  const sfxText = document.getElementById('sfx-text');

  if (sfxBtn) {
    sfxBtn.addEventListener('click', () => {
      const isMuted = synth.toggleMute();
      if (sfxIcon) sfxIcon.textContent = isMuted ? '🔇' : '🔊';
      if (sfxText) sfxText.textContent = isMuted ? 'MUTE' : 'SFX';
      if (!isMuted) synth.playTick(600);
    });
  }

  // 8. Email Quick Copy Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      synth.playSuccess();
      navigator.clipboard.writeText('sujayat2007@gmail.com').then(() => {
        const orig = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied ✔';
        setTimeout(() => {
          copyEmailBtn.textContent = orig;
        }, 2000);
      });
    });
  }

  // 9. Direct Inquiry Transmission Form
  const inqForm = document.getElementById('inquiry-form');
  const inqBtn = document.getElementById('inq-submit-btn');

  if (inqForm && inqBtn) {
    inqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      synth.playChirp(720);

      const orig = inqBtn.innerHTML;
      inqBtn.disabled = true;
      inqBtn.innerHTML = `<span>Dispatching Transmission...</span>`;

      setTimeout(() => {
        synth.playSuccess();
        inqBtn.innerHTML = `<span>Transmission Received ✔</span>`;
        inqForm.reset();

        setTimeout(() => {
          inqBtn.disabled = false;
          inqBtn.innerHTML = orig;
        }, 3000);
      }, 1000);
    });
  }

  // 10. Nav anchor smooth scrolling via Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        lenis.scrollTo(targetEl, { offset: -60, duration: 1.4 });
      }
    });
  });

  console.log('⚡ Sujay Seeram Technical Pastel Narrative V2 Initialized.');
});
