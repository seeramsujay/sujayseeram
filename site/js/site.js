// ─── Hero fade-in ────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('hero-quote').classList.remove('opacity-0');
    }, 800);
});

// ─── Scroll engine ───────────────────────────────────────────────────────
// One rAF per scroll event, bound directly to scrollY (no lerp trailing).
// All geometry is measured in a single batch and cached; the per-frame
// path only does arithmetic and writes transform/opacity when they change.
const sections = ['hero', 'about', 'odyssey', 'contact'];
const indicators = document.querySelectorAll('.indicator-dot');
const progressBar = document.getElementById('scroll-progress-bar');
const progressFill = document.getElementById('timeline-progress-fill');
const timelineEl = document.getElementById('timeline-container');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let timelineNodes = [];
let nodeTops = [];
let lastWritten = [];
let sectionOffsets = [];
let tlTop = 0;
let tlHeight = 1;
let maxScroll = 1;
let vh = window.innerHeight;
let vw = window.innerWidth;
let activeSection = '';
let rafId = 0;

const isDesktop = () => vw > 768;
const docTop = (el) => { let t = 0; for (let c = el; c; c = c.offsetParent) t += c.offsetTop; return t; };

// Measure everything in one pass. Sticky nodes report their stuck position,
// so un-stick them all at once via a class (2 layouts total, not 2 per node).
const measure = () => {
    vh = window.innerHeight;
    vw = window.innerWidth;
    const root = document.documentElement;
    root.classList.add('is-measuring');
    sectionOffsets = sections.map(id => { const el = document.getElementById(id); return el ? docTop(el) : 0; });
    nodeTops = Array.from(timelineNodes, docTop);
    if (timelineEl) { tlTop = docTop(timelineEl); tlHeight = timelineEl.offsetHeight || 1; }
    root.classList.remove('is-measuring');
    maxScroll = Math.max(1, root.scrollHeight - vh);
};

const nodeState = (idx, sy) => {
    const stickyTop = vh * 0.25;
    const target = nodeTops[idx] - stickyTop;
    if (sy < target) {
        const prev = idx > 0 ? nodeTops[idx - 1] : null;
        const dist = prev !== null ? Math.max(vh * 0.4, nodeTops[idx] - prev) : vh * 0.6;
        const diff = target - sy;
        if (diff > dist) return [30, 0.9, 0, 15];
        const p = 1 - diff / dist;
        const e = p * (2 - p);
        return [(1 - e) * 30, 0.9 + 0.1 * e, e, (1 - e) * 15];
    }
    if (idx === nodeTops.length - 1) return [0, 1, 1, 0];
    const nextTarget = nodeTops[idx + 1] - stickyTop;
    if (sy >= nextTarget) return [-30, 0.95, 0, -15];
    const p = (sy - target) / (nextTarget - target);
    if (p <= 0.6) return [0, 1, 1, 0];
    const e = ((p - 0.6) / 0.4) ** 2;
    return [-e * 30, 1 - e * 0.05, 1 - e, -e * 15];
};

const update = () => {
    rafId = 0;
    const sy = window.scrollY;

    if (progressBar) progressBar.style.transform = `scaleX(${Math.min(1, sy / maxScroll).toFixed(4)})`;
    if (progressFill) {
        const p = Math.max(0, Math.min(1, (vh * 0.75 - (tlTop - sy)) / tlHeight));
        progressFill.style.transform = `scaleY(${p.toFixed(4)})`;
    }

    let current = sections[0];
    for (let i = 0; i < sections.length; i++) if (sy >= sectionOffsets[i] - 320) current = sections[i];
    if (current !== activeSection) {
        activeSection = current;
        indicators.forEach(dot => dot.classList.toggle('active', dot.dataset.section === current));
    }

    if (!isDesktop() || reduceMotion) return;
    for (let i = 0; i < timelineNodes.length; i++) {
        const [y, sc, op, rx] = nodeState(i, sy);
        const key = `${y.toFixed(1)}|${sc.toFixed(3)}|${op.toFixed(2)}|${rx.toFixed(1)}`;
        if (key === lastWritten[i]) continue;
        lastWritten[i] = key;
        const n = timelineNodes[i];
        n.style.opacity = op.toFixed(2);
        n.style.transform = `translate3d(0, ${y.toFixed(1)}vh, 0) scale(${sc.toFixed(3)}) rotateX(${rx.toFixed(1)}deg)`;
        n.style.visibility = op === 0 ? 'hidden' : '';
    }
};

const schedule = () => { if (!rafId) rafId = requestAnimationFrame(update); };
const remeasure = () => { measure(); lastWritten = []; schedule(); };

window.addEventListener('scroll', schedule, { passive: true });

// Phones fire resize whenever the URL bar shows/hides. Only a width change
// (rotation, window drag) can change layout enough to need a re-measure.
let resizeTimer = 0;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const widthChanged = window.innerWidth !== vw;
        const wasDesktop = isDesktop();
        if (!widthChanged) { vh = window.innerHeight; maxScroll = Math.max(1, document.documentElement.scrollHeight - vh); schedule(); return; }
        vw = window.innerWidth;
        if (wasDesktop !== isDesktop()) setTimelineMode();
        remeasure();
    }, 150);
}, { passive: true });

// ─── General section reveal (about, vault cards, etc.) ───────────────────
const fadeIO = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            if (el.classList.contains('project-item') || el.classList.contains('post-card')) {
                el.style.transitionDelay = `${Math.min(delay, 240)}ms`;
                delay += 60;
            }
            el.classList.add('is-visible');
            fadeIO.unobserve(el);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.glass-card, .edu-item, .post-card').forEach(el => {
    if (el.closest('.timeline-node')) return;
    el.classList.add('fade-up');
    fadeIO.observe(el);
});

// Dynamic Glowing Tag Parsing Routine
document.querySelectorAll('.post-tags').forEach(el => {
    const rawText = el.textContent.trim();
    if (rawText && !rawText.includes('<span')) {
        const tags = rawText.split(/\s+/);
        el.innerHTML = tags.map(tag => tag.trim() ? `<span>${tag.trim()}</span>` : '').join('');
    }
});

// Vault Filtering
const filterBtns = document.querySelectorAll('.vault-header .filter-btn');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.project-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Reading Room Toggle
const togglePost = (header) => {
    const article = header.parentElement;
    article.classList.toggle('expanded');

    const icon = header.querySelector('.material-symbols-outlined');
    if (article.classList.contains('expanded')) {
        icon.textContent = 'unfold_less';
    } else {
        icon.textContent = 'unfold_more';
    }
};

const togglePostsSection = () => {
    const wrapper = document.getElementById('posts-wrapper');
    const btn = document.getElementById('posts-toggle-btn');
    const isOpen = wrapper.style.gridTemplateRows === '1fr';

    wrapper.style.gridTemplateRows = isOpen ? '0fr' : '1fr';
    btn.innerHTML = isOpen ?
        '<span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px;">expand_more</span> SHOW_LOGS' :
        '<span class="material-symbols-outlined" style="vertical-align: middle; font-size: 18px;">expand_less</span> HIDE_LOGS';

    if (!isOpen) {
        setTimeout(() => {
            document.getElementById('posts').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
};

// Clipboard Copy
const copyPostText = (btn, text) => {
    navigator.clipboard.writeText(text).then(() => {
        const label = btn.querySelector('.font-metadata');
        const originalText = label.textContent;
        label.textContent = 'Copied ✓';
        setTimeout(() => label.textContent = originalText, 2000);
    });
};

// Mobile Navigation Drawer Controllers
const openMobileDrawer = () => {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer) {
        drawer.style.display = 'block';
        drawer.offsetHeight; // force reflow
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

const closeMobileDrawer = () => {
    const drawer = document.getElementById('mobile-nav-drawer');
    if (drawer) {
        drawer.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            drawer.style.display = 'none';
        }, 500);
    }
};

// Gestures & Project Cycling for Bottom Sheets on Mobile
const cycleProjectDetail = (direction) => {
    if (!window.currentProjectsList || window.currentProjectsList.length === 0 || !window.currentActiveProjectName) return;
    
    const index = window.currentProjectsList.findIndex(p => p.name === window.currentActiveProjectName);
    if (index === -1) return;
    
    let nextIndex = index + direction;
    if (nextIndex < 0) nextIndex = window.currentProjectsList.length - 1;
    if (nextIndex >= window.currentProjectsList.length) nextIndex = 0;
    
    const nextProject = window.currentProjectsList[nextIndex];
    const containerEl = document.querySelector('#project-detail-overlay .overlay-scroll-container');
    
    if (containerEl) {
        containerEl.style.opacity = '0';
        containerEl.style.transform = direction > 0 ? 'translateX(-20px)' : 'translateX(20px)';
        containerEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }
    
    setTimeout(() => {
        const descHtml = nextProject.description;
        const repoLink = (nextProject.githubLink && nextProject.githubLink.trim() !== '') ? nextProject.githubLink : null;
        
        openProjectDetailOverlay(nextProject.name, descHtml, repoLink);
        
        if (containerEl) {
            containerEl.scrollTop = 0;
            containerEl.style.transform = direction > 0 ? 'translateX(20px)' : 'translateX(-20px)';
            containerEl.offsetHeight; // Force reflow
            containerEl.style.opacity = '1';
            containerEl.style.transform = 'translateX(0)';
        }
    }, 200);
};

const setupOverlayGestures = (overlayId, closeFn, allowCycling = false) => {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;

    const scrollContainer = overlay.querySelector('.overlay-scroll-container');
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let startTime = 0;
    let isVerticalSwipe = false;
    let isHorizontalSwipe = false;
    let canDismiss = false;

    overlay.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 768) return;

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        currentX = startX;
        currentY = startY;
        startTime = Date.now();
        isVerticalSwipe = false;
        isHorizontalSwipe = false;

        const touchOnHeader = e.target.closest('.mobile-drag-handle') || e.target.closest('.overlay-header');
        const scrollAtTop = scrollContainer ? scrollContainer.scrollTop <= 5 : true;
        canDismiss = touchOnHeader || scrollAtTop;

        overlay.style.transition = 'none';
    }, { passive: true });

    overlay.addEventListener('touchmove', (e) => {
        if (window.innerWidth > 768) return;

        const touch = e.touches[0];
        currentX = touch.clientX;
        currentY = touch.clientY;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        if (!isVerticalSwipe && !isHorizontalSwipe) {
            if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 10) {
                isVerticalSwipe = true;
            } else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
                isHorizontalSwipe = true;
            }
        }

        if (isVerticalSwipe && canDismiss && diffY > 0) {
            overlay.style.transform = `translateY(${diffY}px)`;
        }
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
        if (window.innerWidth > 768) return;

        const diffX = currentX - startX;
        const diffY = currentY - startY;
        const duration = Date.now() - startTime;
        const velocityY = diffY / duration;
        const velocityX = diffX / duration;

        overlay.style.transition = '';

        if (isVerticalSwipe && canDismiss) {
            if (diffY > 150 || (velocityY > 0.4 && diffY > 50)) {
                overlay.style.transform = '';
                closeFn();
            } else {
                overlay.style.transform = '';
            }
        } else if (isHorizontalSwipe && allowCycling) {
            if (Math.abs(diffX) > 100 || Math.abs(velocityX) > 0.4) {
                if (diffX > 0) {
                    cycleProjectDetail(-1); // Swiped right: go previous
                } else {
                    cycleProjectDetail(1);  // Swiped left: go next
                }
            }
        }

        startX = 0;
        startY = 0;
        currentX = 0;
        currentY = 0;
        isVerticalSwipe = false;
        isHorizontalSwipe = false;
    }, { passive: true });
};

// Initialize Gestures
document.addEventListener('DOMContentLoaded', () => {
    setupOverlayGestures('project-detail-overlay', closeProjectDetailOverlay, true);
    setupOverlayGestures('vault-overlay', closeVaultOverlay, false);
    setupOverlayGestures('posts-overlay', closePostsOverlay, false);
});

// Terminal Logic
let keyHistory = '';
window.addEventListener('keydown', (e) => {
    keyHistory += e.key.toLowerCase();
    if (keyHistory.endsWith('build')) {
        openTerminal();
        keyHistory = '';
    }
    if (e.key === 'Escape') { closeTerminal(); closeVaultOverlay(); closePostsOverlay(); closeProjectDetailOverlay(); closeMobileDrawer(); }
});


const openVaultOverlay = () => {
    const el = document.getElementById('vault-overlay');
    el.style.display = 'flex';
    el.offsetHeight;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeVaultOverlay = () => {
    const el = document.getElementById('vault-overlay');
    el.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        el.style.display = 'none';
    }, 500);
};

const openPostsOverlay = () => {
    const el = document.getElementById('posts-overlay');
    el.style.display = 'flex';
    el.offsetHeight;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closePostsOverlay = () => {
    const el = document.getElementById('posts-overlay');
    el.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => {
        el.style.display = 'none';
    }, 500);
};

// Terminal Telemetry Boot Sequence Simulation
const terminalCommands = [
    { type: 'telemetry', text: 'SYSTEM_BOOTLOADER: INITIATING SECURE ARCHIVE TELEMETRY...' },
    { type: 'telemetry', text: 'LOADING SEGMENT 0x0A: KAVACH_THREAT_INTERCEPTOR... ACTIVE' },
    { type: 'telemetry', text: 'LOADING SEGMENT 0x0B: SYNTHSCOPE_LOGIC_SIMULATOR... LOADED' },
    { type: 'telemetry', text: 'DECRYPTING STUDENT CREDENTIALS: SUJAY_SEERAM // ECE // AMRITA' },
    { type: 'telemetry', text: 'ESTABLISHING INTERACTIVE TTY LINK... SECURE CONNECTION FOUND.' },
    { type: 'telemetry', text: '---------------------------------------------------------' },
    { type: 'prompt', text: 'whoami' },
    { type: 'output', text: 'Sujay Seeram. First-year ECE at Amrita.<br>Building things since before it was cool.<br>30+ repos. Hackathons. Research. Hardware.<br>The grind is the point.' },
    { type: 'prompt', text: 'ls projects/active' },
    { type: 'grid', items: [
        'informed-poll (Google Solution Challenge)',
        'sentinel-mind (Multi-agent AI)',
        'evolvai-dash (Melbourne presentation)',
        'specRAG (Datasheet parser)',
        'PersonalAssistant (Local-first AI)',
        'smart-home-assistant (IoT framework)',
        'AI-PID-Tuner (Control Theory)',
        'mixer (Terminal DJ)'
    ]},
    { type: 'prompt', text: 'cat system/archive' },
    { type: 'output', text: 'GITHUB_ARCHIVE: <a href="https://github.com/seeramsujay" target="_blank" style="color: var(--optimism-mint); text-decoration: none; border-bottom: 1px solid rgba(74,222,128,0.2);">github.com/seeramsujay</a><br>PROFESSIONAL_LOG: <a href="https://linkedin.com/in/sujayseeram" target="_blank" style="color: var(--optimism-mint); text-decoration: none; border-bottom: 1px solid rgba(74,222,128,0.2);">linkedin.com/in/sujayseeram</a>' },
    { type: 'prompt', text: '_' }
];

let terminalBooting = false;

const startTerminalBootSequence = () => {
    if (terminalBooting) return;
    terminalBooting = true;

    const outputEl = document.getElementById('terminal-output');
    if (!outputEl) return;

    outputEl.innerHTML = '';
    let lineIndex = 0;

    const printNext = () => {
        if (lineIndex >= terminalCommands.length) {
            terminalBooting = false;
            return;
        }

        const cmd = terminalCommands[lineIndex];
        lineIndex++;

        if (cmd.type === 'telemetry') {
            const div = document.createElement('div');
            div.className = 'terminal-output font-mono';
            div.style.color = 'var(--text-muted)';
            div.style.fontSize = '11px';
            div.textContent = cmd.text;
            outputEl.appendChild(div);
            outputEl.scrollTop = outputEl.scrollHeight;
            setTimeout(printNext, 40 + Math.random() * 50);
        } else if (cmd.type === 'prompt') {
            const promptDiv = document.createElement('div');
            promptDiv.className = 'terminal-prompt';
            if (cmd.text === '_') {
                promptDiv.innerHTML = '> <span class="terminal-cursor">_</span>';
                outputEl.appendChild(promptDiv);
                outputEl.scrollTop = outputEl.scrollHeight;
                terminalBooting = false;
                return;
            }
            promptDiv.textContent = '> ';
            outputEl.appendChild(promptDiv);
            outputEl.scrollTop = outputEl.scrollHeight;

            let charIndex = 0;
            const typeChar = () => {
                if (charIndex < cmd.text.length) {
                    promptDiv.textContent += cmd.text[charIndex];
                    charIndex++;
                    outputEl.scrollTop = outputEl.scrollHeight;
                    setTimeout(typeChar, 20 + Math.random() * 30);
                } else {
                    setTimeout(printNext, 120);
                }
            };
            typeChar();
        } else if (cmd.type === 'output') {
            const div = document.createElement('div');
            div.className = 'terminal-output';
            div.innerHTML = cmd.text;
            outputEl.appendChild(div);
            outputEl.scrollTop = outputEl.scrollHeight;
            setTimeout(printNext, 200);
        } else if (cmd.type === 'grid') {
            const gridDiv = document.createElement('div');
            gridDiv.className = 'terminal-grid';
            cmd.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.textContent = item;
                gridDiv.appendChild(itemDiv);
            });
            outputEl.appendChild(gridDiv);
            outputEl.scrollTop = outputEl.scrollHeight;
            setTimeout(printNext, 250);
        }
    };

    printNext();
};

const openTerminal = () => {
    const el = document.getElementById('terminal-overlay');
    if (el) {
        el.style.display = 'flex';
        el.offsetHeight; // Force reflow
        el.classList.add('active');
        document.body.style.overflow = 'hidden';
        startTerminalBootSequence();
    }
};

const closeTerminal = () => {
    const el = document.getElementById('terminal-overlay');
    if (el) {
        el.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            el.style.display = 'none';
        }, 500);
    }
};

const openTerminalArchive = () => {
    openTerminal();
};

// Accessibility Fix: Hide ligature icons from screen readers
document.querySelectorAll('.material-symbols-outlined').forEach(icon => {
    icon.setAttribute('aria-hidden', 'true');
});


// ─── Project Detail Overlay Logic ──────────────────────────────────────────
// ─── Lazy assets for the project overlay ─────────────────────────────────
// READMEs (~240 KB) and the markdown parser are only needed once a project is
// opened, so they load on demand (and are prefetched when the page is idle).
let readmesPromise = null;
const loadReadmes = () => readmesPromise || (readmesPromise = fetch('data/readmes.json')
    .then(r => (r.ok ? r.json() : {}))
    .catch(() => { readmesPromise = null; return {}; }));

let markedPromise = null;
const loadMarked = () => markedPromise || (markedPromise = new Promise(resolve => {
    if (window.marked) return resolve();
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js';
    s.onload = () => resolve();
    s.onerror = () => { markedPromise = null; resolve(); };
    document.head.appendChild(s);
}));

const escapeHtml = (str) => str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const whenIdle = window.requestIdleCallback || ((fn) => setTimeout(fn, 2500));
window.addEventListener('load', () => whenIdle(() => { loadReadmes(); loadMarked(); }, { timeout: 5000 }), { once: true });



const openProjectDetailOverlay = (name, descHtml, repoLink) => {
    window.currentActiveProjectName = name;
    const el = document.getElementById('project-detail-overlay');
    const titleEl = document.getElementById('project-detail-title');
    const repoEl = document.getElementById('project-detail-repo-name');
    const bodyEl = document.getElementById('project-detail-body');

    titleEl.textContent = `PROJECT_DETAIL // ${name.toUpperCase()}`;

    if (repoLink) {
        repoEl.innerHTML = `<a href="${repoLink}" target="_blank" style="border: none; color: var(--optimism-teal); font-weight: 500;">seeramsujay/${name} ↗</a>`;
    } else {
        repoEl.textContent = 'SECRET';
    }

    // Show the short description instantly; swap in the full README when ready.
    bodyEl.innerHTML = `<p>${descHtml}</p>`;
    const repoKey = name === 'Word-Association-Test-SSB' ? 'Word-Association-Test-SSB-' : name;
    Promise.all([loadReadmes(), loadMarked()]).then(([readmes]) => {
        const md = readmes[repoKey];
        if (!md || window.currentActiveProjectName !== name) return;
        bodyEl.innerHTML = (window.marked && typeof marked.parse === 'function')
            ? marked.parse(md)
            : `<div style="white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(md)}</div>`;
    });

    el.style.display = 'flex';
    el.offsetHeight;
    el.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeProjectDetailOverlay = () => {
    const el = document.getElementById('project-detail-overlay');
    if (el) {
        el.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            el.style.display = 'none';
        }, 500);
    }
};

const projects = JSON.parse(document.getElementById('projects-data').textContent);

function renderAllProjects() {
    const timelineContainer = document.getElementById('timeline-container');
    const projectGrid = document.getElementById('project-grid');

    if (!timelineContainer || !projectGrid) return;

    timelineContainer.innerHTML = '';
    projectGrid.innerHTML = '';

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

    const sortedProjects = [...projects].sort((a, b) => parseProjectDate(b.date) - parseProjectDate(a.date));

    // Only public projects appear in the Timeline
    const timelineProjects = sortedProjects.filter(project => project.githubLink && project.githubLink.trim() !== '');

    let currentYear = null;
    let yearIndex = 0;

    timelineProjects.forEach((project) => {
        const dateObj = parseProjectDate(project.date);
        const year = dateObj.getFullYear();

        if (year !== currentYear && year > 1970) {
            currentYear = year;
            yearIndex = 0;
            
            const yearDiv = document.createElement('div');
            yearDiv.className = 'timeline-year';
            yearDiv.dataset.year = year.toString();
            if (timelineContainer.children.length > 0) {
                yearDiv.style.marginTop = '10rem';
            }
            yearDiv.textContent = year;
            timelineContainer.appendChild(yearDiv);
        }

        const side = yearIndex % 2 === 0 ? 'left' : 'right';
        yearIndex++;

        const node = document.createElement('div');
        node.className = `timeline-node ${side}`;
        node.dataset.year = (year && year > 1970 ? year : (project.date ? project.date.split(' ').pop() : '')).toString();
        node.dataset.category = (project.category || '').toLowerCase();

        const awardBadgeHtml = project.awardText 
            ? `<div class="award-badge ${project.awardType || 'participation'}">${project.awardText}</div>`
            : '';

        const githubLinkHtml = (project.githubLink && project.githubLink.trim() !== '')
            ? `<a href="${project.githubLink}" target="_blank" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1);">GITHUB</a>`
            : '';

        node.innerHTML = `
            <div class="timeline-card-content glass-card">
                <div class="flex justify-between items-start" style="margin-bottom: 1.5rem;">
                    <span class="font-mono" style="font-size: 10px; color: var(--optimism-mint);">${project.date} · ${project.status}</span>
                    ${awardBadgeHtml}
                </div>
                <h3 style="font-size: 1.75rem; font-style: italic; margin-bottom: 1rem;">${project.name}</h3>
                <p class="font-body" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem;">
                    ${project.description}
                </p>
                <div class="flex gap-6 font-mono" style="font-size: 10px; letter-spacing: 0.2em;">
                    ${githubLinkHtml}
                </div>
            </div>
        `;
        timelineContainer.appendChild(node);
    });

    sortedProjects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-item glass-card';
        card.setAttribute('data-category', project.category);

        const awardBadgeHtml = project.awardText 
            ? `<div class="award-badge ${project.awardType || 'participation'}">${project.awardText}</div>`
            : '';

        const tagsHtml = (project.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('\n');

        const isSecret = !project.githubLink || project.githubLink.trim() === '';
        const githubLinkHtml = (!isSecret)
            ? `<a href="${project.githubLink}" target="_blank" class="font-mono"
                  style="font-size: 10px; color: var(--optimism-mint); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                  VIEW_REPO <span class="material-symbols-outlined" style="font-size: 12px;">arrow_right_alt</span>
               </a>`
            : `<div class="font-mono" style="font-size: 10px; color: var(--optimism-teal); opacity: 0.8; margin-top: 1rem; letter-spacing: 0.1em; display: flex; align-items: center; gap: 0.35rem;">
                  <span class="material-symbols-outlined" style="font-size: 12px;">lock</span> SECRET_VAULT
               </div>`;

        card.innerHTML = `
            <div class="flex justify-between items-start">
                <span class="font-mono" style="font-size: 10px; opacity: 0.6;">${project.status}</span>
                ${awardBadgeHtml}
            </div>
            <h3 style="font-size: 1.5rem; font-style: italic;">${project.name}</h3>
            <p class="font-body" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">
                ${project.description}
            </p>
            <div class="project-tags">
                ${tagsHtml}
            </div>
            ${githubLinkHtml}
        `;
        projectGrid.appendChild(card);
    });

    document.querySelectorAll('.timeline-card-content, .project-item').forEach(card => {
        const h3 = card.querySelector('h3');
        if (!h3) return;

        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) return;

            const name = h3.textContent.trim();
            const descEl = card.querySelector('.font-body, p');
            const descHtml = descEl ? descEl.innerHTML : 'No description available.';

            const githubLink = card.querySelector('a[href*="github.com"]');
            const repoLink = githubLink ? githubLink.href : null;

            openProjectDetailOverlay(name, descHtml, repoLink);
        });
    });

    window.currentProjectsList = sortedProjects;

}

function initMobileOdysseyTabs() {
    const tabsContainer = document.getElementById('mobile-odyssey-tabs');
    if (!tabsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.mobile-tab-btn');
    const nodes = () => document.querySelectorAll('.timeline-node');
    const years = () => document.querySelectorAll('.timeline-year');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter;
            const allNodes = nodes();
            const allYears = years();

            if (filter === 'all') {
                allNodes.forEach(n => n.style.display = 'block');
                allYears.forEach(y => y.style.display = 'block');
                const firstNode = allNodes[0];
                if (firstNode) {
                    firstNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else if (['2026', '2025', '2024'].includes(filter)) {
                allNodes.forEach(n => n.style.display = 'block');
                allYears.forEach(y => y.style.display = 'block');

                const targetCard = Array.from(allNodes).find(n => n.dataset.year === filter);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Category filter
                let firstVisible = null;
                allNodes.forEach(n => {
                    const cat = (n.dataset.category || '').toLowerCase();
                    if (cat === filter.toLowerCase()) {
                        n.style.display = 'block';
                        if (!firstVisible) firstVisible = n;
                    } else {
                        n.style.display = 'none';
                    }
                });
                allYears.forEach(y => y.style.display = 'none');

                if (firstVisible) {
                    firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    });

    window.syncMobileTabToYear = (year) => {
        const activeTab = tabsContainer.querySelector('.mobile-tab-btn.active');
        if (activeTab && ['all', '2026', '2025', '2024'].includes(activeTab.dataset.filter)) {
            tabs.forEach(t => {
                if (t.dataset.filter === year) {
                    t.classList.add('active');
                    t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                } else if (t.dataset.filter !== 'all') {
                    t.classList.remove('active');
                }
            });
        }
    };
}

let mobileCenterObserver = null;
function initMobileCenterObserver() {
    if (mobileCenterObserver) {
        mobileCenterObserver.disconnect();
    }
    if (window.innerWidth > 768) return;

    mobileCenterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.timeline-node.mobile-center-active').forEach(el => {
                    if (el !== entry.target) el.classList.remove('mobile-center-active');
                });
                entry.target.classList.add('mobile-center-active');
                if (entry.target.dataset.year && window.syncMobileTabToYear) {
                    window.syncMobileTabToYear(entry.target.dataset.year);
                }
            }
        });
    }, {
        rootMargin: '-35% 0px -35% 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.timeline-node').forEach(node => {
        mobileCenterObserver.observe(node);
    });
}

// Switch the timeline between the desktop 3D conveyor and the mobile list.
function setTimelineMode() {
    if (isDesktop()) {
        if (mobileCenterObserver) mobileCenterObserver.disconnect();
        document.querySelectorAll('.timeline-node, .timeline-year').forEach(el => { el.style.display = ''; });
        document.querySelectorAll('.timeline-node').forEach(n => n.classList.remove('mobile-center-active'));
    } else {
        timelineNodes.forEach(n => { n.style.transform = ''; n.style.opacity = ''; n.style.visibility = ''; });
        initMobileCenterObserver();
    }
}

function initTimelineAnimations() {
    timelineNodes = document.querySelectorAll('.timeline-node');
    setTimelineMode();
    remeasure();
    // Web fonts and late images shift layout; re-measure once they settle.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
    window.addEventListener('load', remeasure, { once: true });
}

// --- Theme Switching Handler ---
(function() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.contains('light-theme');
        if (isLight) {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('portfolio-theme', 'dark');
        } else {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('portfolio-theme', 'light');
        }
    });
})();

renderAllProjects();
initTimelineAnimations();
initMobileOdysseyTabs();
