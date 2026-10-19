/**
 * Showcase & Complete 76 Archive Manager
 * Technical Pastel Glassmorphic Grid and Dossier Binding
 */

import { allProjects } from '../data/projectsData.js';
import { synth } from '../audio/synth.js';

export class ProjectShowcase {
  constructor(modal) {
    this.modal = modal;

    this.container = document.getElementById('archive-grid-container');
    this.searchInput = document.getElementById('archive-search-field');
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.countTag = document.getElementById('archive-count-tag');

    this.activeCategory = 'all';
    this.searchQuery = '';

    this.init();
  }

  init() {
    this.renderArchive();
    this.bindEvents();
    this.bindGlobalDossierTriggers();
  }

  renderArchive() {
    if (!this.container) return;

    const filtered = allProjects.filter(p => {
      // Category filter
      if (this.activeCategory !== 'all') {
        const cat = (p.category || '').toLowerCase();
        if (!cat.includes(this.activeCategory)) return false;
      }

      // Search query
      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = (p.description || '').toLowerCase().includes(q);
        const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
        if (!inName && !inDesc && !inTags) return false;
      }

      return true;
    });

    if (this.countTag) {
      this.countTag.textContent = `${filtered.length} BUILDS DISPLAYED`;
    }

    if (filtered.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--text-muted);">
          No matching engineering builds found.
        </div>
      `;
      return;
    }

    this.container.innerHTML = filtered.map(p => {
      const awardBadge = p.awardText
        ? `<div class="badge-award" style="margin-bottom:6px;">${p.awardText}</div>`
        : '';
      const tags = (p.tags || []).slice(0, 3).map(t => `<span style="font-family:var(--font-mono);font-size:0.68rem;padding:2px 6px;background:rgba(255,255,255,0.7);border-radius:4px;color:var(--text-muted);">${t}</span>`).join(' ');

      return `
        <article class="glass-card archive-card" data-name="${p.name}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
            <h4 style="font-size:1.05rem;font-weight:700;color:var(--text-primary);letter-spacing:-0.01em;">${p.name}</h4>
            <span style="font-family:var(--font-mono);font-size:0.68rem;color:var(--text-muted);">${p.date || 'Active'}</span>
          </div>
          ${awardBadge}
          <p style="font-size:0.82rem;line-height:1.5;color:var(--text-secondary);margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
            ${p.description || 'System repository and sovereign codebase.'}
          </p>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid rgba(0,0,0,0.05);">
            <div style="display:flex;gap:4px;flex-wrap:wrap;">${tags}</div>
            <button type="button" class="btn btn-sm btn-secondary open-dossier-btn" data-name="${p.name}">
              Inspect ↗
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Re-bind newly rendered cards
    this.container.querySelectorAll('.archive-card, .open-dossier-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        const name = el.dataset.name;
        const proj = allProjects.find(p => p.name === name);
        if (proj) this.modal.open(proj);
      });
    });
  }

  bindEvents() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderArchive();
      });
    }

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.dataset.category || 'all';
        synth.playTick(640);
        this.renderArchive();
      });
    });
  }

  // Bind all other dossier buttons throughout the document (MotorSafe, AQUAPULSE, etc.)
  bindGlobalDossierTriggers() {
    document.querySelectorAll('.open-dossier-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        const proj = allProjects.find(p => p.name === name);
        if (proj) {
          this.modal.open(proj);
        }
      });
    });
  }
}
