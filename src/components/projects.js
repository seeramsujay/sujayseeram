// Projects Module for Sujay Seeram Portfolio V2
import { playClickSFX, playHoverSFX } from '../audio/soundEngine.js';

export const projectsData = [
  {
    id: "slingshot",
    name: "Slingshot",
    date: "Apr 2026",
    status: "HACKATHON",
    category: "hackathon",
    tags: ["ML", "AQI_FORECAST", "FASTAPI"],
    description: "Adaptive Urban Dust Mitigation Framework. Pressure-built solo hackathon entry modeling particulate dispersion physics.",
    githubLink: "https://github.com/seeramsujay/slingshot",
    awardText: "⚡ Shaastra Finalist",
    readme: "Slingshot combines real-time air quality sensor streams with physics dispersion models to optimize urban dust suppression deployments."
  },
  {
    id: "evolvai",
    name: "EVolvAI",
    date: "Mar 2026",
    status: "PHYSICS ML",
    category: "physics",
    tags: ["PYTORCH", "STREAMLIT", "GENETIC_GA"],
    description: "Physics-informed generative EV charging demand prediction pipeline using deep VAE models and genetic optimization.",
    githubLink: "https://github.com/seeramsujay/EVolvAI",
    awardText: "🏆 Best Energy AI Solution",
    readme: "EVolvAI embeds physical vehicle battery degradation & grid constraints directly into loss functions to prevent transformer overload."
  },
  {
    id: "specrag",
    name: "specRAG",
    date: "Mar 2026",
    status: "SOVEREIGN RAG",
    category: "tool",
    tags: ["SQLITE", "LOCAL_RAG", "PYTHON"],
    description: "Zero-hallucination local firmware auditing gateway designed to run on non-GPU host machines with extreme accuracy.",
    githubLink: "https://github.com/seeramsujay/specRAG",
    awardText: "🛡️ Digital Sovereignty Standard",
    readme: "specRAG enforces deterministic citation boundaries against hardware datasheets to eliminate LLM hallucinations during embedded design."
  },
  {
    id: "smartring",
    name: "smartRing",
    date: "Jan 2026",
    status: "HARDWARE",
    category: "hardware",
    tags: ["ESP32", "LOW_POWER_CPP", "I2C"],
    description: "Open-source biometric hardware interface ring featuring custom I2C sensor drivers and micro-watt sleep states.",
    githubLink: "https://github.com/seeramsujay/smartRing",
    awardText: "",
    readme: "smartRing captures PPG pulse oximetry and skin temperature telemetry while operating for 72+ hours on a micro LiPo cell."
  },
  {
    id: "motorsafe",
    name: "MotorSafe / motor-sim",
    date: "Feb 2026",
    status: "SIMULATION",
    category: "physics",
    tags: ["PHYSICS", "SIMULATION", "DSP", "FFT"],
    description: "Tri-modal Edge-AI motor diagnostics using Fast Fourier Transform and Isolation Forest for industrial fault prevention.",
    githubLink: "https://github.com/seeramsujay/motor-sim",
    awardText: "TRL-4 Lab Validated",
    readme: "MotorSafe fuses electrical load currents (ACS712) and mechanical vibration (MPU6050) to detect bearing drag days before failure."
  },
  {
    id: "informed-poll",
    name: "Informed Poll",
    date: "Apr 2026",
    status: "HACKATHON (ACTIVE)",
    category: "hackathon",
    tags: ["VITE", "LANCEDB", "GEMINI"],
    description: "Civic tech for first-time voters. RAG assistant + Firebase + swipeable candidate ballot UI.",
    githubLink: "https://github.com/seeramsujay/informed-poll",
    awardText: "🇮🇳 Google Solution Challenge",
    readme: "Informed Poll demystifies political elections for first-time voters using LanceDB vector search and non-partisan verified datasets."
  },
  {
    id: "antigravity-helper",
    name: "AntigravityHelper",
    date: "Feb 2026",
    status: "CLI / AGENT",
    category: "tool",
    tags: ["CLI", "AGENT", "RUST", "REACT_NATIVE"],
    description: "Sovereign assistant helper for managing local skill protocols and automated agent workflows with 'Git Tinder' UI.",
    githubLink: "https://github.com/seeramsujay/AntigravityHelper",
    awardText: "",
    readme: "AntigravityHelper bridges Rust Actix-Web PTY terminals with mobile gesture review for instant PR triage."
  }
];

export function initProjectsMatrix() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  renderProjects(projectsData, container);

  // Setup Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClickSFX();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      if (filter === 'all') {
        renderProjects(projectsData, container);
      } else {
        const filtered = projectsData.filter(p => p.category === filter || (filter === 'physics' && (p.tags.includes('PHYSICS') || p.category === 'physics')));
        renderProjects(filtered, container);
      }
    });
  });
}

function renderProjects(list, container) {
  container.innerHTML = '';

  list.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card glass-card tilt-card';

    const awardHtml = project.awardText ? `<div class="award-badge">${project.awardText}</div>` : '';
    const tagsHtml = project.tags.map(t => `<span class="tag-pill">${t}</span>`).join('');

    card.innerHTML = `
      <div>
        <div class="project-header">
          <span class="project-status">${project.status}</span>
          <span class="project-date" style="font-family:var(--font-mono);font-size:0.7rem;color:var(--color-text-dim);">${project.date}</span>
        </div>
        ${awardHtml}
        <h3 class="project-name">${project.name}</h3>
        <p class="project-desc">${project.description}</p>
      </div>

      <div>
        <div class="project-tags">${tagsHtml}</div>
        <div class="project-footer">
          <a href="${project.githubLink}" target="_blank" rel="noopener" class="project-link" onclick="event.stopPropagation();">
            <span>REPOSITORY</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
          <button class="btn btn-secondary inspect-btn" style="padding: 6px 12px; font-size: 0.75rem;">INSPECT SPEC</button>
        </div>
      </div>
    `;

    card.addEventListener('mouseenter', () => playHoverSFX());
    card.addEventListener('click', () => {
      playClickSFX();
      openProjectModal(project);
    });

    container.appendChild(card);
  });
}

function openProjectModal(project) {
  const modal = document.getElementById('project-modal');
  const body = document.getElementById('project-modal-body');
  if (!modal || !body) return;

  const tagsHtml = project.tags.map(t => `<span class="pill">${t}</span>`).join('');

  body.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="project-status">${project.status}</span>
      <h2 style="font-family:var(--font-display);font-size:2rem;margin-top:10px;">${project.name}</h2>
    </div>
    <p style="color:var(--color-text-muted);font-size:1rem;line-height:1.6;margin-bottom:24px;">${project.description}</p>

    <div style="margin-bottom:24px;">
      <h4 style="font-family:var(--font-mono);font-size:0.8rem;color:var(--neon-cyan);margin-bottom:8px;">TECH STACK</h4>
      <div class="pill-list">${tagsHtml}</div>
    </div>

    <div style="background:rgba(0,0,0,0.4);padding:20px;border-radius:10px;border:var(--border-glass);margin-bottom:24px;">
      <h4 style="font-family:var(--font-mono);font-size:0.8rem;color:var(--neon-purple);margin-bottom:8px;">SPECIFICATION DETAILS</h4>
      <p style="font-family:var(--font-mono);font-size:0.85rem;color:var(--color-text-muted);line-height:1.5;">${project.readme}</p>
    </div>

    <a href="${project.githubLink}" target="_blank" rel="noopener" class="btn btn-primary glow-btn" style="width:100%;justify-content:center;">
      <span>OPEN GITHUB REPOSITORY (${project.name})</span>
    </a>
  `;

  modal.classList.remove('hidden');
}

// Modal Close Handlers
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('project-modal-close');
  const modal = document.getElementById('project-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      playClickSFX();
      modal.classList.add('hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
});
