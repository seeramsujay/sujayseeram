// Interactive Cyber Terminal CLI for Sujay Seeram Portfolio V2
import { playClickSFX, playKeySFX } from '../audio/soundEngine.js';
import { projectsData } from './projects.js';

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

  // Keyboard shortcut Ctrl+K or Cmd+K
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

  // Handle Command Inputs
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
<span class="term-highlight">AVAILABLE COMMANDS:</span>
  - <span class="text-cyan">bio</span>          : Print author identity &amp; credentials
  - <span class="text-cyan">projects</span>     : List selected space repositories
  - <span class="text-cyan">skills</span>       : Display hardware, AI &amp; Web skill matrix
  - <span class="text-cyan">philosophy</span>   : Read Extreme Economic Engineering tenets
  - <span class="text-cyan">ping</span>         : Check sovereign telemetry health
  - <span class="text-cyan">contact</span>      : Output connection coordinates
  - <span class="text-cyan">clear</span>        : Wipe terminal screen
        `);
        break;

      case 'bio':
        appendHistory(`
<span class="term-highlight">SUJAY SEERAM (Suzaykid / Tubelight)</span>
Electronics &amp; Communication Engineering Student @ Amrita Vishwa Vidyapeetham.
Focus: Resource-constrained cyber-physical systems, physics-informed AI models, bare-metal ESP32 C++ design, and sovereign local document RAG.
        `);
        break;

      case 'projects':
        let listStr = '<span class="term-highlight">SELECTED SPACE REPOSITORIES:</span><br/>';
        projectsData.forEach(p => {
          listStr += `• <span class="text-cyan">${p.name.padEnd(18)}</span> [${p.status}] - ${p.description}<br/>`;
        });
        appendHistory(listStr);
        break;

      case 'skills':
        appendHistory(`
<span class="term-highlight">HARDWARE &amp; EMBEDDED:</span> ESP32, Bare-metal C++, I2C/SPI, MPU6050, ACS712, DSP/FFT
<span class="term-highlight">COMPUTE &amp; AI:</span> Python, PyTorch, FastAPI, LanceDB, Rust (Actix/PTY), Scikit-Learn
<span class="term-highlight">GRAPHICS &amp; WEB:</span> Three.js, WebGL/GLSL, Vite, Vanilla CSS, Web Audio API
        `);
        break;

      case 'philosophy':
        appendHistory(`
<span class="term-highlight">EXTREME ECONOMIC ENGINEERING:</span>
"Maximize system capabilities while minimizing component counts and computational overhead."
1. Mathematical Theory &amp; Physics First Principles
2. Economical Hardware: Minimalist Component Budgets
3. Sovereign Intelligence: Low-Compute Local Frameworks
        `);
        break;

      case 'ping':
        appendHistory(`
<span class="text-green">PONG!</span> Telemetry status: 100% OPERATIONAL
Host baseline: MacBook Air 2017 (Non-GPU)
Digital Sovereignty Covenant: PCPPL 1.0 ACTIVE
        `);
        break;

      case 'contact':
        appendHistory(`
Email: <a href="mailto:sujayat2007@gmail.com" class="text-cyan">sujayat2007@gmail.com</a>
GitHub: <a href="https://github.com/seeramsujay" target="_blank" class="text-cyan">github.com/seeramsujay</a>
Identity: Suzay / Tubelight
        `);
        break;

      case 'clear':
        history.innerHTML = '';
        break;

      default:
        appendHistory(`<span class="text-crimson">Command not found: '${cmd}'. Type 'help' for available commands.</span>`);
        break;
    }
  }
}
