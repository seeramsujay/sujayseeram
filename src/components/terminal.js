// Interactive Cyber Terminal CLI for Sujay Seeram Portfolio V2
import { playClickSFX, playKeySFX } from '../audio/soundEngine.js';
import { projectsData } from '../data/projectsData.js';

export function initTerminal() {
  const modal = document.getElementById('terminal-modal');
  const closeBtn = document.getElementById('terminal-close');
  const input = document.getElementById('terminal-input');
  const history = document.getElementById('terminal-history');
  const triggerBtns = [
    document.getElementById('terminal-quick-btn'),
    document.getElementById('hero-terminal-btn')
  ];

  if (!modal || !input || !history) return;

  function openTerminal() {
    playClickSFX();
    modal.classList.remove('hidden');
    input.focus();
  }

  function closeTerminal() {
    playClickSFX();
    modal.classList.add('hidden');
  }

  triggerBtns.forEach(btn => {
    if (btn) btn.addEventListener('click', openTerminal);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (modal.classList.contains('hidden')) {
        openTerminal();
      } else {
        closeTerminal();
      }
    }
  });

  input.addEventListener('keydown', (e) => {
    playKeySFX();

    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      if (!command) return;

      appendHistory(`sujay@core:~$ ${command}`, 'user-cmd');
      executeCommand(command);
      input.value = '';
      history.scrollTop = history.scrollHeight;
    }
  });

  function appendHistory(text, type = 'output') {
    const p = document.createElement('div');
    p.className = `term-line ${type}`;
    p.innerHTML = text;
    history.appendChild(p);
  }

  function executeCommand(cmd) {
    switch (cmd) {
      case 'help':
        appendHistory(`
<span style="color:#fff;font-weight:bold;">AVAILABLE COMMANDS:</span>
  - <span style="color:var(--accent-cyan);">bio</span>          : Print author identity &amp; background
  - <span style="color:var(--accent-cyan);">projects</span>     : List selected space repositories
  - <span style="color:var(--accent-cyan);">skills</span>       : Display hardware, AI &amp; Web skill matrix
  - <span style="color:var(--accent-cyan);">philosophy</span>   : Read Extreme Economic Engineering tenets
  - <span style="color:var(--accent-cyan);">ping</span>         : Check sovereign telemetry health
  - <span style="color:var(--accent-cyan);">contact</span>      : Output connection coordinates
  - <span style="color:var(--accent-cyan);">clear</span>        : Wipe terminal screen
        `);
        break;

      case 'bio':
        appendHistory(`
<span style="color:#fff;font-weight:bold;">SUJAY SEERAM (Suzaykid)</span>
First-Year ECE Undergraduate @ Amrita Vishwa Vidyapeetham (2025–Present).
Running on a 2017 MacBook Air with Linux Mint. Focus: Resource-constrained cyber-physical systems, physics-informed AI, bare-metal ESP32 C++, and local-first sovereign architectures.
        `);
        break;

      case 'projects':
        let listStr = '<span style="color:#fff;font-weight:bold;">SELECTED SPACE REPOSITORIES:</span><br/>';
        projectsData.forEach(p => {
          listStr += `• <span style="color:var(--accent-cyan);">${p.name.padEnd(20)}</span> [${p.status}] - ${p.description}<br/>`;
        });
        appendHistory(listStr);
        break;

      case 'skills':
        appendHistory(`
<span style="color:#fff;font-weight:bold;">HARDWARE &amp; EMBEDDED:</span> ESP32, Bare-Metal C++, I2C/SPI, MPU6050, ACS712, DSP/FFT
<span style="color:#fff;font-weight:bold;">COMPUTE &amp; AI:</span> Python, PyTorch, FastAPI, LanceDB, Rust, Scikit-Learn
<span style="color:#fff;font-weight:bold;">GRAPHICS &amp; WEB:</span> Three.js, WebGL, Vite, Vanilla CSS, Web Audio API
        `);
        break;

      case 'philosophy':
        appendHistory(`
<span style="color:#fff;font-weight:bold;">EXTREME ECONOMIC ENGINEERING:</span>
"I don't wait for a prompt. I build because the problem is in the room."
1. Local-First: Privacy is the architecture, not a feature.
2. Simulation: Simulate first. Deploy second. Break nothing.
3. Sovereignty: Code your environment. Don't let it code you.
        `);
        break;

      case 'ping':
        appendHistory(`
<span style="color:var(--accent-emerald);">PONG!</span> Telemetry status: 100% OPERATIONAL
Environment: MacBook Air 2017 (Linux Mint)
PCPPL 1.0 Covenant: ACTIVE
        `);
        break;

      case 'contact':
        appendHistory(`
Email: <a href="mailto:sujayat2007@gmail.com" style="color:var(--accent-cyan);">sujayat2007@gmail.com</a>
GitHub: <a href="https://github.com/seeramsujay" target="_blank" style="color:var(--accent-cyan);">github.com/seeramsujay</a>
LinkedIn: <a href="https://linkedin.com/in/sujayseeram" target="_blank" style="color:var(--accent-cyan);">in/sujayseeram</a>
        `);
        break;

      case 'clear':
        history.innerHTML = '';
        break;

      default:
        appendHistory(`<span style="color:#ef4444;">Command not found: '${cmd}'. Type 'help' for available commands.</span>`);
        break;
    }
  }
}
