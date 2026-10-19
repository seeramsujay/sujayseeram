/**
 * Architectural Project Dossier Drawer (Light Mode & Editorial)
 * Powered by Marked to render project READMEs.
 */

import { marked } from 'marked';
import { synth } from '../audio/synth.js';

export class ProjectModal {
  constructor() {
    this.modalEl = document.getElementById('project-drawer');
    this.backdropEl = document.getElementById('drawer-backdrop');
    this.closeBtn = document.getElementById('drawer-close-btn');
    this.titleEl = document.getElementById('drawer-title');
    this.metaEl = document.getElementById('drawer-meta');
    this.tagsEl = document.getElementById('drawer-tags');
    this.linksEl = document.getElementById('drawer-links');
    this.bodyEl = document.getElementById('drawer-body');
    this.copyMdBtn = document.getElementById('drawer-copy-btn');

    this.currentProject = null;
    this.init();
  }

  init() {
    if (!this.modalEl) return;

    // Configure marked for clean, safe rendering
    marked.setOptions({
      gfm: true,
      breaks: true
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.close());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
    });

    if (this.copyMdBtn) {
      this.copyMdBtn.addEventListener('click', () => this.copyMarkdown());
    }
  }

  open(project) {
    if (!project) return;
    this.currentProject = project;

    synth.playTick(580);

    // Title & Metadata
    if (this.titleEl) this.titleEl.textContent = project.name;
    if (this.metaEl) {
      const awardBadge = project.awardText
        ? `<span class="award-chip">${project.awardText}</span>`
        : '';
      const dateStr = project.date || 'Active';
      const catStr = (project.category || 'Engineering').toUpperCase();
      this.metaEl.innerHTML = `${awardBadge} <span class="meta-tag">${catStr}</span> <span class="meta-date">${dateStr}</span>`;
    }

    // Tags
    if (this.tagsEl) {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      this.tagsEl.innerHTML = tags
        .map(t => `<span class="tech-tag">${t}</span>`)
        .join('');
    }

    // Links
    if (this.linksEl) {
      if (project.githubLink) {
        this.linksEl.innerHTML = `
          <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
            <span>Open Repository ↗</span>
          </a>
        `;
      } else {
        this.linksEl.innerHTML = `
          <span class="badge-airgapped">Local / Sovereign Build</span>
        `;
      }
    }

    // Markdown Content
    if (this.bodyEl) {
      const rawReadme = project.readme && project.readme.trim().length > 0
        ? project.readme
        : `# ${project.name}\n\n${project.description || 'Architectural project documentation.'}\n\n### System Overview\nThis build operates sovereignly on local hardware without cloud telemetry.`;

      try {
        this.bodyEl.innerHTML = marked.parse(rawReadme);
      } catch (e) {
        this.bodyEl.textContent = rawReadme;
      }
    }

    // Show drawer
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (!this.modalEl) return;
    synth.playTick(420);
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  copyMarkdown() {
    if (!this.currentProject) return;
    const content = this.currentProject.readme || this.currentProject.description || '';
    navigator.clipboard.writeText(content).then(() => {
      synth.playSuccess();
      if (this.copyMdBtn) {
        const orig = this.copyMdBtn.innerHTML;
        this.copyMdBtn.innerHTML = `<span>Copied ✔</span>`;
        setTimeout(() => {
          this.copyMdBtn.innerHTML = orig;
        }, 2000);
      }
    });
  }
}
