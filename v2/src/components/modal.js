/**
 * Sovereign Cyber Dossier / README Modal Viewer
 * Uses marked to render full markdown documentation from projects_db.json
 */

import { marked } from 'marked';
import { synth } from '../audio/synth.js';

export class ProjectModal {
  constructor() {
    this.modalEl = document.getElementById('project-modal');
    this.backdropEl = document.getElementById('modal-backdrop');
    this.closeBtn = document.getElementById('modal-close-btn');
    this.titleEl = document.getElementById('modal-project-title');
    this.metaEl = document.getElementById('modal-project-meta');
    this.tagsEl = document.getElementById('modal-project-tags');
    this.linksEl = document.getElementById('modal-project-links');
    this.bodyEl = document.getElementById('modal-project-body');
    this.copyBtn = document.getElementById('modal-copy-md-btn');

    this.currentProject = null;
    this.init();
  }

  init() {
    if (!this.modalEl) return;

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.close());
    }

    if (this.copyBtn) {
      this.copyBtn.addEventListener('click', () => this.copyMarkdown());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalEl.classList.contains('hidden')) {
        this.close();
      }
    });
  }

  open(project) {
    if (!this.modalEl || !project) return;
    this.currentProject = project;

    synth.playWhoosh();

    // Populate Header
    if (this.titleEl) {
      this.titleEl.textContent = project.name;
    }

    if (this.metaEl) {
      let metaHtml = `<span class="meta-tag date">${project.date}</span>`;
      metaHtml += `<span class="meta-tag status">${project.status}</span>`;
      if (project.awardText) {
        metaHtml += `<span class="meta-tag award">${project.awardText}</span>`;
      }
      this.metaEl.innerHTML = metaHtml;
    }

    // Populate Tags
    if (this.tagsEl) {
      this.tagsEl.innerHTML = (project.tags || [])
        .map(t => `<span class="cyber-chip">${t}</span>`)
        .join('');
    }

    // Populate Action Links
    if (this.linksEl) {
      let linksHtml = '';
      if (project.githubLink && !project.private) {
        linksHtml += `
          <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <span>REPOSITORY // GITHUB ↗</span>
          </a>
        `;
      } else {
        linksHtml += `
          <span class="btn btn-disabled">
            <span>🔒 AIR-GAPPED / PRIVATE SPEC</span>
          </span>
        `;
      }
      this.linksEl.innerHTML = linksHtml;
    }

    // Populate Markdown Body
    if (this.bodyEl) {
      let rawMd = project.readme && project.readme.trim().length > 0 
        ? project.readme 
        : this.generateDefaultDossier(project);

      try {
        this.bodyEl.innerHTML = marked.parse(rawMd);
      } catch (err) {
        console.error('Marked parsing error:', err);
        this.bodyEl.textContent = rawMd;
      }
    }

    // Display modal
    this.modalEl.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  generateDefaultDossier(project) {
    return `
# ${project.name}

> **Category:** \`${project.category || 'tool'}\` | **Timeline:** \`${project.date}\`

${project.description}

---

## 🛠️ Architecture & Parameters

- **Subsystem Category:** ${project.status}
- **Stack & Tooling:** ${(project.tags || []).join(', ') || 'Bare-metal C / Python'}
- **Deployment Profile:** Local-First / Sovereign Computing
- **Repository Access:** ${project.githubLink ? `[${project.githubLink}](${project.githubLink})` : 'Confidential Local Archive'}

${project.awardText ? `\n> **Honors & Validation:** ${project.awardText}\n` : ''}

---
*Telemetry Dossier generated automatically from Sujay Seeram's Sovereign Engineering Database.*
`;
  }

  copyMarkdown() {
    if (!this.currentProject) return;
    synth.playTick();
    const md = this.currentProject.readme || this.generateDefaultDossier(this.currentProject);
    navigator.clipboard.writeText(md).then(() => {
      if (this.copyBtn) {
        const orig = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = `<span>COPIED ✔</span>`;
        setTimeout(() => {
          this.copyBtn.innerHTML = orig;
        }, 2000);
      }
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
    });
  }

  close() {
    if (!this.modalEl) return;
    synth.playTick();
    this.modalEl.classList.add('hidden');
    document.body.classList.remove('modal-open');
    this.currentProject = null;
  }
}
