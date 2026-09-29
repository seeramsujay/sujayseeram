/**
 * Sovereign Cyber Terminal CLI
 * Features: Full interactive command prompt, command history (up/down),
 * quick command chips, project dossier inspection, sound feedback, ⌘K trigger.
 */

import { activeProjects, allProjects, getProjectByName } from '../data/projectsData.js';
import { synth } from '../audio/synth.js';

export class CyberTerminal {
  constructor(projectModal) {
    this.modal = projectModal;
    this.terminalEl = document.getElementById('terminal-modal');
    this.backdropEl = document.getElementById('terminal-backdrop');
    this.closeBtn = document.getElementById('terminal-close-btn');
    this.input = document.getElementById('terminal-input');
    this.historyEl = document.getElementById('terminal-output');
    this.triggerBtns = document.querySelectorAll('[data-trigger-terminal]');
    this.chips = document.querySelectorAll('.term-quick-chip');

    this.commandHistory = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    if (!this.terminalEl || !this.input || !this.historyEl) return;

    // Trigger buttons
    this.triggerBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdropEl) {
      this.backdropEl.addEventListener('click', () => this.close());
    }

    // Quick command chips
    this.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        if (cmd) {
          synth.playTick();
          this.execute(cmd);
          this.input.focus();
        }
      });
    });

    // Keyboard shortcut (⌘K or Ctrl+K or Esc)
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && !this.terminalEl.classList.contains('hidden')) {
        this.close();
      }
    });

    // Input handling with history navigation
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = this.input.value.trim();
        if (val) {
          this.commandHistory.push(val);
          this.historyIndex = this.commandHistory.length;
          this.execute(val);
          this.input.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.input.value = this.commandHistory[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.input.value = this.commandHistory[this.historyIndex];
        } else {
          this.historyIndex = this.commandHistory.length;
          this.input.value = '';
        }
      } else {
        synth.playTick();
      }
    });
  }

  open() {
    synth.playGlitch();
    this.terminalEl.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 50);
  }

  close() {
    synth.playTick();
    this.terminalEl.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  toggle() {
    if (this.terminalEl.classList.contains('hidden')) {
      this.open();
    } else {
      this.close();
    }
  }

  print(content, type = 'log') {
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerHTML = content;
    this.historyEl.appendChild(line);
    this.historyEl.scrollTop = this.historyEl.scrollHeight;
  }

  execute(rawCmd) {
    const parts = rawCmd.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    // Echo command
    this.print(`<span class="term-prompt">suzay@macbook-2017:~$</span> <span class="term-cmd">${rawCmd}</span>`, 'user-cmd');

    switch (cmd) {
      case 'help':
        this.print(`
<div class="term-box">
  <div class="term-highlight">SOVEREIGN CORE OS v2.4 // TELEMETRY TERMINAL</div>
  <div class="term-grid">
    <div><span class="cmd-name">whoami</span>       : Profile, hardware, and engineering ethos</div>
    <div><span class="cmd-name">projects</span>     : Print active project directory from DB</div>
    <div><span class="cmd-name">cat &lt;name&gt;</span>     : Read project README / dossier</div>
    <div><span class="cmd-name">skills</span>       : Hardware, DSP, control systems, and AI stack</div>
    <div><span class="cmd-name">tenets</span>       : Extreme Economic Engineering principles</div>
    <div><span class="cmd-name">awards</span>       : Hackathon podiums and scientific citations</div>
    <div><span class="cmd-name">ping</span>         : Telemetry packet round-trip time</div>
    <div><span class="cmd-name">sfx</span>          : Toggle audio synthesis engine</div>
    <div><span class="cmd-name">contact</span>      : Direct communication coordinates</div>
    <div><span class="cmd-name">clear</span>        : Wipe terminal display</div>
  </div>
</div>`);
        break;

      case 'whoami':
      case 'bio':
        this.print(`
<div class="term-text">
  <strong style="color:var(--mint-400);">SUJAY SEERAM (Suzaykid)</strong><br/>
  First-Year ECE @ Amrita Vishwa Vidyapeetham (2025–Present)<br/>
  Daily Driver: <strong>2017 MacBook Air (Linux Mint XFCE)</strong><br/>
  Philosophy: <em>"Extreme Economic Engineering"</em> — Maximizing performance per milli-watt & per dollar.<br/>
  Focus: Cyber-Physical Systems, DSP/FFT, Bare-metal ESP32, and Sovereign AI.
</div>`);
        break;

      case 'projects':
      case 'ls':
        const count = activeProjects.length;
        let listHtml = `<div class="term-highlight">ACTIVE REGISTRY [${count} BUILDS FOUND]:</div><ul class="term-list">`;
        activeProjects.slice(0, 15).forEach(p => {
          listHtml += `<li><span style="color:var(--cyan-400);">${p.name.padEnd(20)}</span> <span style="color:var(--mint-400);">[${p.status}]</span> ${p.description.substring(0, 60)}...</li>`;
        });
        listHtml += `</ul><div style="color:var(--text-muted);font-size:0.75rem;">(Showing first 15 of ${count}. Use 'cat &lt;project-name&gt;' or the web matrix below for full dossiers.)</div>`;
        this.print(listHtml);
        break;

      case 'cat':
      case 'read':
      case 'open':
        if (!arg) {
          this.print(`Usage: <span class="term-cmd">cat &lt;project-name&gt;</span> (e.g., 'cat specRAG', 'cat informed-poll')`, 'error');
          break;
        }
        const proj = getProjectByName(arg);
        if (proj) {
          this.print(`Opening interactive dossier for <strong style="color:var(--mint-400);">${proj.name}</strong>...`);
          synth.playSuccess();
          this.close();
          if (this.modal) {
            this.modal.open(proj);
          }
        } else {
          this.print(`Error: Build '${arg}' not located in sovereign database. Run 'projects' to list.`, 'error');
        }
        break;

      case 'skills':
      case 'stack':
        this.print(`
<div class="term-box">
  <div style="color:var(--mint-400);font-weight:600;">HARDWARE & EMBEDDED SILICON:</div>
  <div>ESP32, Bare-Metal C++, I2C/SPI Bus Protocols, MPU6050, ACS712 Hall Sensors, ZMPT101B</div>
  <div style="color:var(--cyan-400);font-weight:600;margin-top:8px;">COMPUTE, DSP & PHYSICS:</div>
  <div>FFT Spectral Analysis, PyTorch, FastAPI, LanceDB, Rust Actix, Python 3.12, Control Theory</div>
  <div style="color:var(--amber-400);font-weight:600;margin-top:8px;">INTERFACE & GRAPHICS:</div>
  <div>Three.js WebGL, React/Vite, Vanilla CSS Architectures, Web Audio API, Linux Shell</div>
</div>`);
        break;

      case 'tenets':
      case 'philosophy':
        this.print(`
<div class="term-box">
  <div style="color:var(--mint-400);font-weight:bold;">EXTREME ECONOMIC ENGINEERING:</div>
  <div>1. <strong>Local-First:</strong> If it requires an always-on cloud server to breathe, it is fragile. Privacy is architecture.</div>
  <div>2. <strong>Physics First:</strong> Model before code. Validate harmonic frequencies and boundary conditions before deployment.</div>
  <div>3. <strong>Sovereign Hardware:</strong> A 2017 MacBook Air running Linux Mint beats bloated multi-gigabyte cloud containers. Every milliwatt counts.</div>
</div>`);
        break;

      case 'awards':
        this.print(`
<div class="term-box">
  <div style="color:var(--mint-400);font-weight:bold;">NOTABLE PODIUMS & HONORS:</div>
  <div>🏆 <strong>Google Solution Challenge</strong> — Informed Poll (Civic RAG Platform)</div>
  <div>🎖️ <strong>AMD Slingshot</strong> — Slingshot DustVision (Urban Dust Mitigation ML)</div>
  <div>⚡ <strong>Best Energy AI Solution</strong> — EVolvAI (Physics-Informed EV Demand Prediction)</div>
  <div>🛡️ <strong>TRL-4 Lab Validated</strong> — MotorSafe (Tri-Modal Edge-AI Motor Diagnostics)</div>
</div>`);
        break;

      case 'ping':
        const rtt = (Math.random() * 0.8 + 0.2).toFixed(2);
        this.print(`64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=${rtt} ms <span style="color:var(--mint-400);">[NOMINAL HEALTH]</span>`);
        break;

      case 'sfx':
        const muted = synth.toggleMute();
        this.print(`Synthesizer Audio SFX: <strong style="color:${muted ? '#ef4444' : 'var(--mint-400)'};">${muted ? 'OFF' : 'ON'}</strong>`);
        break;

      case 'contact':
        this.print(`
<div class="term-text">
  📧 Email: <a href="mailto:sujayat2007@gmail.com" style="color:var(--mint-400);">sujayat2007@gmail.com</a><br/>
  🐙 GitHub: <a href="https://github.com/seeramsujay" target="_blank" style="color:var(--cyan-400);">github.com/seeramsujay</a><br/>
  💼 LinkedIn: <a href="https://linkedin.com/in/sujayseeram" target="_blank" style="color:var(--cyan-400);">linkedin.com/in/sujayseeram</a>
</div>`);
        break;

      case 'clear':
        this.historyEl.innerHTML = '';
        break;

      default:
        this.print(`Command not recognized: '<span class="term-cmd">${cmd}</span>'. Type <span class="term-cmd">help</span> for available commands.`, 'error');
        break;
    }
  }
}
