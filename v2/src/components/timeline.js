// Chronological Timeline Component for Sujay Seeram Portfolio V2

export const timelineData = [
  {
    date: "Apr 2026",
    title: "Slingshot & Informed Poll",
    category: "Hackathons & AI",
    badge: "Shaastra Finalist & Google Solution Challenge",
    description: "Built Slingshot (Adaptive Urban Dust Mitigation Framework) for Shaastra and Informed Poll (Civic Tech RAG assistant for first-time voters using LanceDB and Gemini).",
    tags: ["FastAPI", "Python", "LanceDB", "Gemini", "Vite"]
  },
  {
    date: "Mar 2026",
    title: "EVolvAI & specRAG Architecture",
    category: "Physics AI & Sovereign Systems",
    badge: "Zero-Hallucination RAG Standard",
    description: "Developed EVolvAI (Physics-informed generative EV charging demand pipeline with PyTorch) and specRAG (Zero-hallucination local firmware auditing gateway for lightweight hosts).",
    tags: ["PyTorch", "SQLite", "Physics-Informed VAE", "Local RAG"]
  },
  {
    date: "Feb 2026",
    title: "MotorSafe Diagnostics & AntigravityHelper",
    category: "Edge Hardware & Agentic CLI",
    badge: "TRL-4 Lab Validated",
    description: "Validated MotorSafe predictive maintenance engine using tri-modal sensor fusion (Current, Voltage, Vibration via MPU6050 & ACS712) and built AntigravityHelper PTY agent orchestrator in Rust.",
    tags: ["DSP / FFT", "ESP32", "Isolation Forest", "Rust", "Actix"]
  },
  {
    date: "Jan 2026",
    title: "smartRing Biometric Hardware",
    category: "Embedded Microcontrollers",
    badge: "Open-Source Hardware",
    description: "Architected smartRing, an open-source ESP32 biometric wearable featuring custom I2C sensor drivers and micro-watt power optimization.",
    tags: ["ESP32", "Bare-Metal C++", "I2C", "Low-Power"]
  },
  {
    date: "Dec 2025",
    title: "Dust-Sim Physics Layer",
    category: "Simulation & Research",
    badge: "Shaastra Entry Preparation",
    description: "Engineered physical simulation layers for particle trajectory and airflow dynamics to validate dust suppression models prior to hardware deployment.",
    tags: ["Physics Simulation", "React", "Vite"]
  },
  {
    date: "Sep 2025",
    title: "YTM-CLI Terminal Audio DSP",
    category: "CLI Tooling",
    badge: "Terminal Audio Engine",
    description: "Created gapless audio playback terminal client optimized for low resource footprint and instant command execution.",
    tags: ["Audio DSP", "CLI", "Shell"]
  },
  {
    date: "Jan 2024",
    title: "Extreme Economic Engineering Vision",
    category: "Foundations",
    badge: "ECE Student @ Amrita",
    description: "Established core engineering philosophy: applying physics first principles to build ultra-economical devices with minimal component budgets.",
    tags: ["Electronics", "Physics First Principles", "PCPPL 1.0"]
  }
];

export function initTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = '';

  timelineData.forEach((item, index) => {
    const timelineCard = document.createElement('div');
    timelineCard.className = 'timeline-item';

    const tagsHtml = item.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('');

    timelineCard.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content glass-card">
        <div class="timeline-header">
          <span class="timeline-date">${item.date}</span>
          <span class="timeline-badge">${item.badge}</span>
        </div>
        <h3 class="timeline-title">${item.title}</h3>
        <span class="timeline-category">${item.category}</span>
        <p class="timeline-desc">${item.description}</p>
        <div class="timeline-tags">${tagsHtml}</div>
      </div>
    `;

    container.appendChild(timelineCard);
  });
}
