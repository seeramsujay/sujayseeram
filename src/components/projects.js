// V1 Projects Vault Component matching V1 logic from projects_db.json
import { projectsData } from '../data/projectsData.js';
import { playClickSFX, playHoverSFX } from '../audio/soundEngine.js';

export function initProjectsMatrix() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  renderProjects(projectsData, container);

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSFX();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderProjects(projectsData, container);
      } else {
        const filtered = projectsData.filter(p => p.category === filter);
        renderProjects(filtered, container);
      }
    });
  });
}

function renderProjects(list, container) {
  container.innerHTML = '';

  list.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-item';

    const awardBadgeHtml = project.awardText 
      ? `<div class="award-badge">${project.awardText}</div>`
      : '';

    const tagsHtml = (project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('');

    const isSecret = !project.githubLink || project.githubLink.trim() === '';
    const githubLinkHtml = (!isSecret)
      ? `<a href="${project.githubLink}" target="_blank" rel="noopener" class="project-link">
          VIEW REPOSITORY ↗
         </a>`
      : `<span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--color-text-dim);display:inline-flex;align-items:center;gap:4px;">
          🔒 SECRET VAULT
         </span>`;

    card.innerHTML = `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-family:var(--font-mono);font-size:0.75rem;color:var(--accent-cyan);">${project.status}</span>
          ${awardBadgeHtml}
        </div>
        <h3 class="timeline-title">${project.name}</h3>
        <p style="color:var(--color-text-sub);font-size:0.95rem;line-height:1.6;margin-bottom:20px;">
          ${project.description}
        </p>
      </div>

      <div>
        <div class="project-tags">${tagsHtml}</div>
        <div style="margin-top:16px;padding-top:16px;border-top:var(--border-subtle);display:flex;justify-content:space-between;align-items:center;">
          ${githubLinkHtml}
        </div>
      </div>
    `;

    card.addEventListener('mouseenter', () => playHoverSFX());
    container.appendChild(card);
  });
}
