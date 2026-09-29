// Direct ES Module import of projects_db.json via Vite
import rawProjects from './projects_db.json';

// Helper to safely parse date like "Apr 2026", "Dec 2025", "2024", etc.
export const parseProjectDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  const parts = String(dateStr).trim().split(/\s+/);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  if (parts.length === 2) {
    const month = monthNames.indexOf(parts[0]);
    const year = parseInt(parts[1], 10);
    if (month !== -1 && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  } else if (parts.length === 1) {
    const year = parseInt(parts[0], 10);
    if (!isNaN(year)) {
      return new Date(year, 0, 1);
    }
  }
  return new Date(0);
};

// Normalize and sort projects chronologically descending (newest first)
export const allProjects = rawProjects.map((p, index) => {
  return {
    id: p.name ? p.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : `proj-${index}`,
    name: p.name || 'Untitled Project',
    date: p.date || 'Present',
    dateObj: parseProjectDate(p.date),
    status: p.status || (p.category ? p.category.toUpperCase() : 'BUILD'),
    category: p.category || 'tool',
    tags: Array.isArray(p.tags) ? p.tags : [],
    description: p.description || 'No description provided.',
    githubLink: p.githubLink || '',
    awardText: p.awardText || '',
    awardType: p.awardType || '',
    readme: p.readme || '',
    archived: Boolean(p.archived),
    opted_out: Boolean(p.opted_out),
    private: Boolean(p.private) || !p.githubLink
  };
}).sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

// Active projects for Odyssey timeline and main showcase
export const activeProjects = allProjects.filter(p => !p.opted_out && !p.archived);

// Alias for backwards compatibility
export const projectsData = activeProjects;

// Vault projects (archived or hidden lab experiments)
export const vaultProjects = allProjects.filter(p => p.archived || (p.opted_out && p.readme));

// Find single project
export const getProjectByName = (name) => {
  if (!name) return null;
  const target = name.toLowerCase().trim();
  return allProjects.find(p => p.name.toLowerCase() === target || p.id === target) || null;
};
