// Preloader Component for Igloo.inc Style Build Screen

export function initPreloader(onComplete) {
  const preloaderEl = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const barEl = document.getElementById('preloader-bar');
  const statusEl = document.getElementById('preloader-status');

  if (!preloaderEl) {
    if (onComplete) onComplete();
    return;
  }

  const logs = [
    "COMPILING WEBGL SHADERS...",
    "INITIALIZING SPATIAL TELEMETRY...",
    "BUILDING CONCENTRIC PORTAL RINGS...",
    "CONNECTING SOVEREIGN EDGE DATA...",
    "SYSTEM READY // DISPATCHING WORLD..."
  ];

  let progress = 0;
  let logIdx = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 4;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      if (percentEl) percentEl.textContent = '100%';
      if (barEl) barEl.style.width = '100%';
      if (statusEl) statusEl.textContent = 'BUILD COMPLETE';

      setTimeout(() => {
        preloaderEl.classList.add('fade-out');
        setTimeout(() => {
          preloaderEl.style.display = 'none';
          if (onComplete) onComplete();
        }, 600);
      }, 300);
    } else {
      if (percentEl) percentEl.textContent = `${progress}%`;
      if (barEl) barEl.style.width = `${progress}%`;

      if (progress > (logIdx + 1) * 20 && logIdx < logs.length - 1) {
        logIdx++;
        if (statusEl) statusEl.textContent = logs[logIdx];
      }
    }
  }, 40);
}
