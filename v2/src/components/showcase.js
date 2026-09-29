/**
 * Project Showcase & Engineering Index Manager
 * Light-mode architectural presentation for Exhibition & Complete Index
 */

import { activeProjects, allProjects } from '../data/projectsData.js';
import { synth } from '../audio/synth.js';

export class ProjectShowcase {
  constructor(modal) {
    this.modal = modal;

    // Elements
    this.featuredContainer = document.getElementById('featured-grid');
    this.indexContainer = document.getElementById('archive-grid');
    this.searchInput = document.getElementById('archive-search');
    this.filterTabs = document.querySelectorAll('.filter-tab');
    this.countBadge = document.getElementById('index-count-badge');

    this.activeCategory = 'all';
    this.searchQuery = '';

    this.init();
  }

  init() {
    this.renderFeatured();
    this.renderIndex();
    this.bindEvents();
  }

  // Curated Landmark Builds for Stage 2 (Exhibition)
  renderFeatured() {
    if (!this.featuredContainer) return;

    // Pick top landmark/award-winning builds
    const landmarkNames = [
      'Informed-poll',
      'MotorSafe-An-IoT-Based-Motor-Fault-Prevention-and-Monitoring-System',
      'Slingshot',
      'Solar-Dust-Mitigation',
      'EcoPulse',
      'Word-Association-Test-SSB'
    ];

    const featured = allProjects.filter(p => landmarkNames.includes(p.name));
    // If not enough match, take first 6 active
    const list = featured.length >= 4 ? featured : activeProjects.slice(0, 6);

    this.featuredContainer.innerHTML = list.map((p, idx) => {
      const awardBadge = p.awardText
        ? `<div class="card-award-tag">${p.awardText}</div>`
        : '';
      const tags = (p.tags || []).slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join('');

      return `
        <article class="exhibition-card cursor-magnetic" data-project-idx="${p.name}">
          <div class="card-topline">
            <span class="card-num">0${idx + 1}</span>
            <span class="card-category">${(p.category || 'System').toUpperCase()}</span>
          </div>
          ${awardBadge}
          <h3 class="card-title">${p.name}</h3>
          <p class="card-desc">${p.description || 'Hardware and software systems engineering.'}</p>
          <div class="card-meta-row">
            <div class="card-tags-wrap">${tags}</div>
            <button type="button" class="btn-inspect" data-name="${p.name}">
              Inspect ↗
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Attach click listeners to cards
    this.featuredContainer.querySelectorAll('.btn-inspect, .exhibition-card').forEach(el => {
      el.addEventListener('click', (e) => {
        const name = el.dataset.name || el.dataset.projectIdx;
        const proj = allProjects.find(p => p.name === name);
        if (proj) {
          this.modal.open(proj);
        }
      });
    });
  }

  // Complete Archive of 76 Projects for Stage 3 (Index)
  renderIndex() {
    if (!this.indexContainer) return;

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

    if (this.countBadge) {
      this.countBadge.textContent = `${filtered.length} BUILDS DISPLAYED`;
    }

    if (filtered.length === 0) {
      this.indexContainer.innerHTML = `
        <div class="empty-state">
          <p>No projects match your current filter criteria.</p>
        </div>
      `;
      return;
    }

    this.indexContainer.innerHTML = filtered.map(p => {
      const awardBadge = p.awardText
        ? `<span class="award-chip-sm">${p.awardText}</span>`
        : '';
      const tags = (p.tags || []).slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join('');
      const dateStr = p.date || 'Active';

      return `
        <div class="index-row-card cursor-magnetic" data-name="${p.name}">
          <div class="index-info-main">
            <div class="index-heading-line">
              <span class="index-title">${p.name}</span>
              ${awardBadge}
            </div>
            <p class="index-desc">${p.description || 'System repository and sovereign codebase.'}</p>
          </div>
          <div class="index-meta-col">
            <span class="index-date">${dateStr}</span>
            <div class="index-tags">${tags}</div>
          </div>
          <div class="index-action-col">
            <button type="button" class="btn btn-sm btn-ghost open-dossier-btn" data-name="${p.name}">
              View Dossier ↗
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach click listeners to rows
    this.indexContainer.querySelectorAll('.index-row-card, .open-dossier-btn').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const name = el.dataset.name;
        const proj = allProjects.find(p => p.name === name);
        if (proj) {
          this.modal.open(proj);
        }
      });
    });
  }

  bindEvents() {
    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim();
        this.renderIndex();
      });
    }

    // Category Tabs
    this.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeCategory = tab.dataset.category || 'all';
        synth.playTick(620);
        this.renderIndex();
      });
    });
  }
}
