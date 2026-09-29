/**
 * StageNavigator — Horizontal Page Carousel & Oil-Motion Cursor Tracker
 * Handles smooth spatial transitions across the 4 stages and pointer spring physics.
 */

import { synth } from '../audio/synth.js';

export class StageNavigator {
  constructor(studioScene) {
    this.studioScene = studioScene;
    this.trackEl = document.getElementById('stages-track');
    this.navLinks = document.querySelectorAll('.stage-nav-item');
    this.prevBtn = document.getElementById('stage-prev-btn');
    this.nextBtn = document.getElementById('stage-next-btn');
    this.indicatorEl = document.getElementById('stage-indicator-cur');
    this.totalStages = 4;
    this.currentStage = 0;

    // Oil-motion cursor physics
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindCursorPhysics();
    this.goToStage(0, false);
  }

  goToStage(index, playSound = true) {
    const target = Math.max(0, Math.min(this.totalStages - 1, index));
    if (playSound && target !== this.currentStage) {
      synth.playWhoosh();
    }
    this.currentStage = target;

    // 1. Move horizontal track
    if (this.trackEl) {
      this.trackEl.style.transform = `translate3d(-${this.currentStage * 100}vw, 0, 0)`;
    }

    // 2. Move 3D Camera Waypoint
    if (this.studioScene) {
      this.studioScene.setPage(this.currentStage);
    }

    // 3. Update Nav Links
    this.navLinks.forEach((link, idx) => {
      if (idx === this.currentStage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // 4. Update Indicators & Buttons
    if (this.indicatorEl) {
      this.indicatorEl.textContent = `0${this.currentStage + 1}`;
    }

    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentStage === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentStage === this.totalStages - 1;
    }
  }

  bindNavigation() {
    // Nav bar items
    this.navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const stageIdx = parseInt(link.dataset.stage, 10);
        if (!isNaN(stageIdx)) {
          this.goToStage(stageIdx);
        }
      });
    });

    // Prev / Next buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.goToStage(this.currentStage - 1);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.goToStage(this.currentStage + 1);
      });
    }

    // Direct page CTA links with [data-goto-stage]
    document.querySelectorAll('[data-goto-stage]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = parseInt(btn.dataset.gotoStage, 10);
        if (!isNaN(idx)) {
          this.goToStage(idx);
        }
      });
    });

    // Keyboard Arrow navigation
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        this.goToStage(this.currentStage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        this.goToStage(this.currentStage - 1);
      }
    });

    // Touch Swipe detection
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      // Ensure horizontal swipe
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          this.goToStage(this.currentStage + 1);
        } else {
          this.goToStage(this.currentStage - 1);
        }
      }
    }, { passive: true });
  }

  // Cursor Parallax Physics (oil-motion damping)
  bindCursorPhysics() {
    if (this.isReducedMotion) return;

    window.addEventListener('pointermove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    const animateCursorPhysics = () => {
      // Damped lerp
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      // Parallax on floating hero badge & cards
      const heroParallax = document.querySelectorAll('.hero-parallax');
      heroParallax.forEach(el => {
        const factor = parseFloat(el.dataset.depth || '15');
        const moveX = this.mouse.x * factor;
        const moveY = this.mouse.y * factor;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      requestAnimationFrame(animateCursorPhysics);
    };

    requestAnimationFrame(animateCursorPhysics);
  }
}
