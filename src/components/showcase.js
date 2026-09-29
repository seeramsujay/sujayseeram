/**
 * Sovereign Odyssey Showcase Matrix
 * Renders active projects from projects_db.json with category filters,
 * real-time search, award badges, and interactive Dossier triggers.
 */

import { activeProjects, vaultProjects } from '../data/projectsData.js';
import { synth } from '../audio/synth.js';

export class ProjectShowcase {
  constructor(projectModal, cyberScene) {
    this.modal = projectModal;
    this.scene = cyberScene;

    this.container = document.getElementById('projects-matrix');
    this.vaultContainer = document.getElementById('vault-matrix');
    this.searchInput = document.getElementById('project-search');
    this.filterBtns = document.querySelectorAll('.category-tab');
    this.countBadge = document.getElementById('project-count-badge');

    this.currentCategory = 'all';
    this.searchQuery = '';

    this.init();
  }

  init() {
    if (!this.container) return;

    this.render();
    this.renderVault();

    // Category Tabs
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        synth.playChirp(720);
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        this.currentCategory = btn.getAttribute('data-category') || 'all';
        if (this.scene) {
          this.scene.setThemeMood(this.currentCategory);
        }
        this.render();
      });
    });

    // Real-time Search Input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        synth.playTick();
        this.render();
      });
    }
  }

  getFilteredProjects() {
    return activeProjects.filter(p => {
      // Category match
      let matchCat = true;
      if (this.currentCategory !== 'all') {
        if (this.currentCategory === 'physics') {
          matchCat = p.category === 'physics' || p.category === 'research';
        } else {
          matchCat = p.category === this.currentCategory;
        }
      }

      // Query match
      let matchQuery = true;
      if (this.searchQuery) {
        const title = p.name.toLowerCase();
        const desc = p.description.toLowerCase();
        const tags = (p.tags || []).join(' ').toLowerCase();
        const status = p.status.toLowerCase();
        matchQuery = title.includes(this.searchQuery) ||
                     desc.includes(this.searchQuery) ||
                     tags.includes(this.searchQuery) ||
                     status.includes(this.searchQuery);
      }

      return matchCat && matchQuery;
    });
  }

  render() {
    if (!this.container) return;

    const list = this.getFilteredProjects();

    if (this.countBadge) {
      this.countBadge.textContent = `${list.length} BUILDS`;
    }

    if (list.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">⚡</div>
          <h3>NO MATCHING BUILDS LOCATED</h3>
          <p>Zero matching records for query "${this.searchQuery}" in category "${this.currentCategory}".</p>
        </div>
      `;
      return;
    }

    this.container.innerHTML = '';

    list.forEach((project, idx) => {
      const card = document.createElement('article');
      card.className = 'cyber-card project-card';
      card.style.animationDelay = `${Math.min(idx * 0.04, 0.6)}s`;

      const awardHtml = project.awardText 
        ? `<div class="card-award-pill">${project.awardText}</div>`
        : '';

      const tagsHtml = (project.tags || []).map(t => `<span class="cyber-chip">${t}</span>`).join('');

      const ghHtml = project.githubLink && !project.private
        ? `<a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="card-link github" title="Open source repository">
             <span>GITHUB ↗</span>
           </a>`
        : `<span class="card-link private" title="Air-gapped local build">
             <span>🔒 PRIVATE</span>
           </span>`;

      card.innerHTML = `
        <div class="card-header">
          <div class="card-meta-line">
            <span class="card-date">${project.date}</span>
            <span class="card-status-badge ${project.category}">${project.status}</span>
          </div>
          ${awardHtml}
        </div>

        <div class="card-body">
          <h3 class="card-title">${project.name}</h3>
          <p class="card-desc">${project.description}</p>
        </div>

        <div class="card-footer">
          <div class="card-tags">${tagsHtml}</div>
          <div class="card-actions">
            ${ghHtml}
            <button type="button" class="card-dossier-btn" data-project-id="${project.id}">
              <span>DOSSIER // README ↘</span>
            </button>
          </div>
        </div>
      `;

      // Tactile sound & hover effects
      card.addEventListener('mouseenter', () => synth.playTick());

      // Open Dossier modal on button click or card click
      const dossierBtn = card.querySelector('.card-dossier-btn');
      dossierBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.modal) this.modal.open(project);
      });

      this.container.appendChild(card);
    });
  }

  renderVault() {
    if (!this.vaultContainer) return;
    this.vaultContainer.innerHTML = '';

    vaultProjects.forEach((project) => {
      const row = document.createElement('div');
      row.className = 'vault-row';

      row.innerHTML = `
        <div class="vault-cell name">
          <strong>${project.name}</strong>
          <span class="vault-date">${project.date}</span>
        </div>
        <div class="vault-cell desc">
          ${project.description}
        </div>
        <div class="vault-cell tags">
          ${(project.tags || []).slice(0, 3).map(t => `<span class="cyber-chip subtle">${t}</span>`).join('')}
        </div>
        <div class="vault-cell action">
          <button type="button" class="btn btn-sm btn-ghost" data-vault-dossier="${project.id}">
            <span>CAT README</span>
          </button>
        </div>
      `;

      const btn = row.querySelector('[data-vault-dossier]');
      if (btn) {
        btn.addEventListener('click', () => {
          if (this.modal) this.modal.open(project);
        });
      }

      this.vaultContainer.appendChild(row);
    });
  }
}
