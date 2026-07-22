// V1 Timeline Component matching V1 Odyssey logic from projects_db.json
import { projectsData } from '../data/projectsData.js';

export function initTimeline() {
  const timelineContainer = document.getElementById('timeline-container');
  if (!timelineContainer) return;

  timelineContainer.innerHTML = '';

  const parseProjectDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames.indexOf(parts[0]);
      const year = parseInt(parts[1]);
      if (month !== -1 && !isNaN(year)) {
        return new Date(year, month);
      }
    } else if (parts.length === 1) {
      const year = parseInt(parts[0]);
      if (!isNaN(year)) {
        return new Date(year, 0);
      }
    }
    return new Date(0);
  };

  const sortedProjects = [...projectsData].sort((a, b) => parseProjectDate(b.date) - parseProjectDate(a.date));
  const timelineProjects = sortedProjects.filter(project => project.githubLink && project.githubLink.trim() !== '');

  let currentYear = null;

  timelineProjects.forEach((project) => {
    const dateObj = parseProjectDate(project.date);
    const year = dateObj.getFullYear();

    if (year !== currentYear && year > 1970) {
      currentYear = year;
      const yearDiv = document.createElement('div');
      yearDiv.className = 'timeline-year-label';
      yearDiv.style.cssText = 'font-family:var(--font-display);font-size:2rem;font-weight:800;color:var(--accent-violet);margin:40px 0 20px 0;';
      yearDiv.textContent = year;
      timelineContainer.appendChild(yearDiv);
    }

    const node = document.createElement('div');
    node.className = 'timeline-node';

    const awardBadgeHtml = project.awardText 
      ? `<div class="award-badge">${project.awardText}</div>`
      : '';

    node.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card-content">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
          <span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--accent-cyan);font-weight:600;">${project.date} · ${project.status}</span>
          ${awardBadgeHtml}
        </div>
        <h3 class="timeline-title">${project.name}</h3>
        <p style="color:var(--color-text-sub);font-size:0.95rem;line-height:1.6;margin-bottom:16px;">
          ${project.description}
        </p>
        <div style="font-family:var(--font-mono);font-size:0.8rem;">
          <a href="${project.githubLink}" target="_blank" rel="noopener" style="color:var(--accent-violet);font-weight:700;text-decoration:none;">VIEW REPOSITORY ↗</a>
        </div>
      </div>
    `;
    timelineContainer.appendChild(node);
  });
}
