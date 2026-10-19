/**
 * v3/src/components/modal.js - Project Card Modal with WebGL Fluid Dynamics (v3)
 * ==============================================================================
 * Role: Controls the floating glass project card modal in v3, displaying concise engineering
 *       summaries, metrics grid, tags, and repo links while running an interactive WebGL
 *       fluid simulation backdrop with pointer physics and sound feedback.
 */

import { FluidSimulation } from '../effects/fluid.js';
import { synth } from '../audio/synth.js';

export class ProjectModal {
  constructor() {
    this.overlayEl = document.getElementById('project-card-modal');
    this.canvasEl = document.getElementById('fluid-modal-canvas');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.dismissBtn = document.getElementById('modal-dismiss-btn');
    this.copyBtn = document.getElementById('modal-copy-summary-btn');

    this.titleEl = document.getElementById('modal-card-title');
    this.descEl = document.getElementById('modal-card-desc');
    this.kickerEl = document.getElementById('modal-card-index');
    this.categoryEl = document.getElementById('modal-card-category');
    this.awardEl = document.getElementById('modal-card-award');
    this.specsEl = document.getElementById('modal-card-specs');
    this.tagsEl = document.getElementById('modal-card-tags');
    this.repoLinkEl = document.getElementById('modal-card-repo-link');
    this.cardEl = document.getElementById('modal-card-element');

    this.currentProject = null;
    this.fluid = null;

    this.init();
  }

  init() {
    if (!this.overlayEl) return;

    // Initialize WebGL Fluid Simulation on modal canvas
    if (this.canvasEl) {
      try {
        this.fluid = new FluidSimulation(this.canvasEl);
      } catch (err) {
        console.warn('Fluid simulation initialization warning:', err);
      }
    }

    // Close button events
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.dismissBtn) {
      this.dismissBtn.addEventListener('click', () => this.close());
    }

    // Click outside card (on overlay backdrop) to close
    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl || e.target === this.canvasEl) {
        this.close();
      }
    });

    // Keyboard ESC to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.overlayEl.classList.contains('hidden')) {
        this.close();
      }
    });

    // Copy Summary button
    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copySummary());
    }

    // Pointer and Touch events for Fluid Simulation
    const handlePointer = (e) => {
      if (!this.fluid || this.overlayEl.classList.contains('hidden')) return;
      let clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      if (clientX !== undefined && clientY !== undefined) {
        this.fluid.updatePointer(clientX, clientY);
      }
    };

    this.overlayEl.addEventListener('pointermove', handlePointer, { passive: true });
    this.overlayEl.addEventListener('pointerdown', handlePointer, { passive: true });
    this.overlayEl.addEventListener('touchmove', handlePointer, { passive: true });
    this.overlayEl.addEventListener('touchstart', handlePointer, { passive: true });
  }

  open(project, index = 1) {
    if (!project) return;
    this.currentProject = project;

    synth.playTick(580);

    // Kicker & Index
    const indexStr = index < 10 ? `0${index}` : `${index}`;
    if (this.kickerEl) {
      this.kickerEl.textContent = `// DOSSIER ${indexStr}`;
    }

    // Category
    if (this.categoryEl) {
      this.categoryEl.textContent = (project.category || 'SYSTEM').toUpperCase();
    }

    // Award badge
    if (this.awardEl) {
      if (project.awardText) {
        this.awardEl.textContent = project.awardText;
        this.awardEl.classList.remove('hidden');
      } else {
        this.awardEl.classList.add('hidden');
      }
    }

    // Title
    if (this.titleEl) {
      this.titleEl.textContent = project.name;
    }

    // Crisp Short Description
    if (this.descEl) {
      const shortDesc = project.description && project.description.trim().length > 0
        ? project.description.trim()
        : 'High-efficiency sovereign engineering codebase.';
      this.descEl.textContent = shortDesc;
    }

    // Specs / Highlights Row
    if (this.specsEl) {
      const dateStr = project.date || 'Active';
      const statusStr = project.status || 'VERIFIED';
      const tagCount = Array.isArray(project.tags) ? `${project.tags.length} Modules` : 'Bare Metal';

      this.specsEl.innerHTML = `
        <div class="spec-entry">
          <span class="spec-title">RELEASE</span>
          <span class="spec-value">${dateStr}</span>
        </div>
        <div class="spec-entry">
          <span class="spec-title">ARCHITECTURE</span>
          <span class="spec-value">${(project.category || 'ECE').toUpperCase()}</span>
        </div>
        <div class="spec-entry">
          <span class="spec-title">TELEMETRY</span>
          <span class="spec-value">${statusStr}</span>
        </div>
        <div class="spec-entry">
          <span class="spec-title">COMPONENTS</span>
          <span class="spec-value">${tagCount}</span>
        </div>
      `;
    }

    // Tags
    if (this.tagsEl) {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      this.tagsEl.innerHTML = tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
    }

    // Repo Link
    if (this.repoLinkEl) {
      if (project.githubLink) {
        this.repoLinkEl.innerHTML = `
          <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
            <span>Open Repository ↗</span>
          </a>
        `;
      } else {
        this.repoLinkEl.innerHTML = `
          <span class="badge-airgapped">Local Sovereign Build</span>
        `;
      }
    }

    // Show Overlay
    this.overlayEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Start Fluid Simulation & trigger an initial blooming pulse
    if (this.fluid && this.fluid.supported) {
      this.fluid.start();
      setTimeout(() => {
        this.fluid.triggerPulse(0.5, 0.45);
      }, 50);
    }
  }

  close() {
    if (!this.overlayEl) return;
    synth.playTick(420);
    this.overlayEl.classList.add('hidden');
    document.body.style.overflow = '';

    // Stop fluid animation loop to conserve GPU/CPU
    if (this.fluid) {
      this.fluid.stop();
      this.fluid.resetPointer();
    }
  }

  copySummary() {
    if (!this.currentProject) return;
    const textToCopy = `${this.currentProject.name} — ${this.currentProject.description || ''} ${this.currentProject.githubLink ? '(' + this.currentProject.githubLink + ')' : ''}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      synth.playSuccess();
      if (this.copyBtn) {
        const orig = this.copyBtn.textContent;
        this.copyBtn.textContent = 'Copied ✔';
        setTimeout(() => {
          this.copyBtn.textContent = orig;
        }, 2000);
      }
    });
  }
}
