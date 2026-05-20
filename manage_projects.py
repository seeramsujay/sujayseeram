#!/usr/bin/env python3
import os
import subprocess
import re
import json
import urllib.request
import datetime

# ── Load .env (stdlib, no pip deps) ──────────────────────────────────────────
def _load_dotenv():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if not os.path.isfile(env_path):
        return
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key = key.strip()
            val = val.strip().strip('"').strip("'")
            if key and key not in os.environ:   # don't override real env vars
                os.environ[key] = val
_load_dotenv()

projects_dir = "/home/suzaykid/Projects"
index_path = "/home/suzaykid/Projects/sujayseeram/index.html"

_public_repos = None
_private_repos = None

known_private = {
    "stride-tech", "specrag", "mixer", "evolvai-dash", "motor-sim",
    "ai-based-pid-tuning-controller", "magic-touch", "smartring",
    "ieeemaker", "magicspice", "antigravityhelper", "maildigest",
    "spice-ai", "audio-lib-cleaner", "test-website", "recordbro",
    "healthcare-android-ai", "semanticmappingengine", "bid-bud",
    "byob", "github-semantic-searcher", "smart-home-assistant-framework",
    "onewheel", "labsheetmaker", "ytm-cli", "personalassistant", "maintenence"
}

def parse_github_repo(url):
    url = url.strip().rstrip('/')
    if url.endswith('.git'):
        url = url[:-4]
    match = re.search(r'github\.com[:/]([^/]+)/([^/]+)$', url)
    if match:
        return match.group(1), match.group(2)
    return None

def load_repos():
    global _public_repos, _private_repos
    if _public_repos is not None and _private_repos is not None:
        return _public_repos, _private_repos
        
    _public_repos = set()
    _private_repos = set()
    try:
        output = subprocess.check_output(
            ["gh", "repo", "list", "--limit", "150", "--json", "name,isPrivate"],
            stderr=subprocess.DEVNULL
        ).decode("utf-8").strip()
        repos = json.loads(output)
        for r in repos:
            name = r["name"].lower()
            if r.get("isPrivate", True):
                _private_repos.add(name)
            else:
                _public_repos.add(name)
    except Exception:
        pass
        
    for name in known_private:
        if name not in _public_repos:
            _private_repos.add(name)
            
    return _public_repos, _private_repos

def is_repo_public(repo_path):
    try:
        url = subprocess.check_output(
            ["git", "-C", repo_path, "config", "--get", "remote.origin.url"],
            stderr=subprocess.DEVNULL
        ).decode("utf-8").strip()
    except Exception:
        return False
        
    if not url:
        return False
        
    parsed = parse_github_repo(url)
    if not parsed:
        return False
        
    owner, name = parsed
    public_repos, _ = load_repos()
    return name.lower() in public_repos

def is_card_repo_public(card):
    url = card["url"]
    if not url:
        return True # Keep non-repo/coursework cards
        
    parsed = parse_github_repo(url)
    if not parsed:
        return True
        
    owner, name = parsed
    name_lower = name.lower()
    
    public_repos, private_repos = load_repos()
    if name_lower in public_repos:
        return True
    if name_lower in private_repos:
        return False
        
    # If owned by the user, but not in the user's public list, it is private
    if owner.lower() in ["seeramsujay", "suzaykid"]:
        return False
        
    # If owned by someone else, check using gh repo view or API
    try:
        output = subprocess.check_output(
            ["gh", "repo", "view", f"{owner}/{name}", "--json", "isPrivate"],
            stderr=subprocess.DEVNULL
        ).decode("utf-8").strip()
        data = json.loads(output)
        return not data.get("isPrivate", True)
    except Exception:
        pass
        
    try:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{owner}/{name}",
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                return True
    except Exception:
        pass
        
    return False

def find_matching_tag(html, start_idx, tag_name):
    """Return the index just AFTER the closing tag, or -1 if malformed."""
    idx = html.find(f'<{tag_name}', start_idx)
    if idx == -1:
        return -1

    nest = 1
    ptr = idx + len(tag_name) + 1
    close_tag = f'</{tag_name}>'
    open_tag  = f'<{tag_name}'
    tag_len   = len(tag_name)

    while nest > 0 and ptr < len(html):
        next_open  = html.find(open_tag, ptr)
        # Validate it is a real open tag (not a prefix of a longer tag name)
        while next_open != -1:
            ca_idx = next_open + tag_len + 1
            char_after = html[ca_idx] if ca_idx < len(html) else ''
            if char_after in (' ', '>', '/', '\n', '\r', '\t'):
                break
            next_open = html.find(open_tag, next_open + 1)

        next_close = html.find(close_tag, ptr)
        if next_close == -1:
            return -1   # malformed HTML – signal failure

        if next_open != -1 and next_open < next_close:
            nest += 1
            ptr = next_open + tag_len + 1
        else:
            nest -= 1
            ptr = next_close + tag_len + 3

    return ptr if nest == 0 else -1

def is_node_public(node_html, public_repos, private_repos):
    urls = re.findall(r'href="([^"]+)"', node_html)
    for url in urls:
        parsed = parse_github_repo(url)
        if parsed:
            owner, name = parsed
            name_lower = name.lower()
            if owner.lower() in ["seeramsujay", "suzaykid"]:
                if name_lower in private_repos:
                    return False
                if name_lower in public_repos:
                    return True
                    
    title_match = re.search(r'<h3[^>]*>([^<]+)</h3>', node_html)
    if title_match:
        title_lower = title_match.group(1).strip().lower()
        if title_lower in private_repos:
            return False
            
    node_text_lower = node_html.lower()
    for repo in private_repos:
        pattern = r'\b' + re.escape(repo.lower()) + r'\b'
        alt_pattern1 = r'\b' + re.escape(repo.lower().replace('-', ' ')) + r'\b'
        alt_pattern2 = r'\b' + re.escape(repo.lower().replace('-', '_')) + r'\b'
        if re.search(pattern, node_text_lower) or re.search(alt_pattern1, node_text_lower) or re.search(alt_pattern2, node_text_lower):
            return False
            
    return True

def get_git_remote(repo_path, default_name):
    try:
        url = subprocess.check_output(
            ["git", "-C", repo_path, "config", "--get", "remote.origin.url"],
            stderr=subprocess.DEVNULL
        ).decode("utf-8").strip()
        if url:
            return url
    except Exception:
        pass
    return f"https://github.com/seeramsujay/{default_name}"

def fetch_remote_readme(repo_name):
    for branch in ["main", "master"]:
        url = f"https://raw.githubusercontent.com/seeramsujay/{repo_name}/{branch}/README.md"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.status == 200:
                    return response.read().decode("utf-8", errors="ignore")
        except Exception:
            pass
    return ""

def get_readme_content(repo_name):
    local_path = os.path.join(projects_dir, repo_name)
    if os.path.isdir(local_path):
        readme_path = os.path.join(local_path, "README.md")
        if os.path.isfile(readme_path):
            try:
                with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
                    return f.read()
            except Exception:
                pass
    return fetch_remote_readme(repo_name)

def parse_readme_desc_text(readme_text, max_len=120):
    if not readme_text:
        return "Personal portfolio project."
    try:
        lines = readme_text.splitlines()
        desc_lines = []
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if line_str.startswith("#") or line_str.startswith("!") or line_str.startswith("[") or line_str.startswith("-") or line_str.startswith("*"):
                continue
            if "Licensing" in line_str or "Prohibitions" in line_str or "Copyright" in line_str:
                continue
            # Skip lines that are primarily HTML tags (e.g. README badges/logos)
            if re.match(r'^\s*<[^>]+>', line_str):
                continue
            cleaned = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', line_str)
            cleaned = cleaned.replace("**", "").replace("__", "").replace("*", "").replace("_", "")
            # Strip any remaining HTML tags from description text
            cleaned = re.sub(r'<[^>]+>', '', cleaned).strip()
            if not cleaned:
                continue
            desc_lines.append(cleaned)
            if len(desc_lines) >= 2:
                break
        
        desc = " ".join(desc_lines).strip()
        if len(desc) > max_len:
            desc = desc[:max_len-3] + "..."
        return desc if desc else "Personal portfolio project."
    except Exception:
        return "Personal portfolio project."

def determine_metadata(repo_name):
    category = "tool"
    label = "UTILITY"
    tags = []
    
    local_path = os.path.join(projects_dir, repo_name)
    has_python = False
    has_js_ts = False
    has_cpp_ino = False
    has_html_css = False
    has_jupyter = False
    
    if os.path.isdir(local_path):
        for root, dirs, files in os.walk(local_path):
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            for file in files:
                if file.endswith('.py'):
                    has_python = True
                elif file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                    has_js_ts = True
                elif file.endswith(('.cpp', '.h', '.ino', '.c')):
                    has_cpp_ino = True
                elif file.endswith(('.html', '.css')):
                    has_html_css = True
                elif file.endswith('.ipynb'):
                    has_jupyter = True
                    
    if has_python:
        tags.append("PYTHON")
    if has_jupyter:
        tags.append("JUPYTER")
    if has_js_ts:
        tags.append("JS_TS")
    if has_cpp_ino:
        tags.append("CPP")
    if has_html_css and not has_js_ts:
        tags.append("HTML_CSS")
        
    if not tags:
        tags.append("SOURCE_CODE")
        
    tags = tags[:3]
    name_lower = repo_name.lower()
    
    if any(x in name_lower for x in ["hardware", "ring", "welder", "satellite", "arduino", "sensor", "pid", "controller"]):
        category = "hardware"
        label = "HARDWARE BUILD"
    elif any(x in name_lower for x in ["ai", "ml", "rag", "model", "classifier", "neural", "evolv", "sentinel", "specrag"]):
        category = "research"
        label = "RESEARCH BUILD"
    elif any(x in name_lower for x in ["hackathon", "challenge", "slingshot", "informed-poll"]):
        category = "hackathon"
        label = "HACKATHON"
    else:
        category = "tool"
        label = "UTILITY"
        
    return category, label, tags

def generate_content_with_gemini(prompt, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None

def check_exists_in_vault(html, repo_name):
    grid_start_marker = 'id="project-grid"'
    grid_start_pos = html.find(grid_start_marker)
    if grid_start_pos == -1:
        return False
    grid_div_start = html.rfind('<div', 0, grid_start_pos)
    grid_end = find_matching_tag(html, grid_div_start, 'div')
    if grid_end == -1:
        return False
    grid_html = html[grid_div_start:grid_end]
    return repo_name.lower() in grid_html.lower()

def check_exists_in_timeline(html, repo_name):
    timeline_start = html.find('<div class="timeline-container">')
    if timeline_start == -1:
        return False
    timeline_end = find_matching_tag(html, timeline_start, 'div')
    if timeline_end == -1:
        return False
    timeline_html = html[timeline_start:timeline_end]
    return repo_name.lower() in timeline_html.lower()

def check_exists_in_posts(html, repo_name):
    posts_start = html.find('<section id="posts"')
    if posts_start == -1:
        posts_start = html.find('id="posts"')
        if posts_start == -1:
            return False
        posts_start = html.rfind('<section', 0, posts_start)
        if posts_start == -1:
            return False
    posts_end = find_matching_tag(html, posts_start, 'section')
    if posts_end == -1:
        return False
    posts_html = html[posts_start:posts_end]
    return repo_name.lower() in posts_html.lower()

def inject_vault_card(html, repo_name, readme_content, api_key):
    category, label, tags = determine_metadata(repo_name)
    description = parse_readme_desc_text(readme_content, max_len=120)
    if api_key:
        prompt = f"Generate a single sentence project description (maximum 120 characters) for a portfolio card for the repository '{repo_name}' based on its README content: {readme_content[:1500]}. The description should be engaging, technical, and concise."
        desc = generate_content_with_gemini(prompt, api_key)
        if desc:
            description = desc.replace('"', '').replace('\n', ' ')
            
    tags_html = "\n".join([f'                            <span class="tag">{t}</span>' for t in tags])
    github_url = f"https://github.com/seeramsujay/{repo_name}"
    
    card_html = f"""
                    <div class="project-item glass-card" data-category="{category}">
                        <div class="flex justify-between items-start">
                            <span class="font-mono" style="font-size: 10px; opacity: 0.6;">{label}</span>
                        </div>
                        <h3 style="font-size: 1.5rem; font-style: italic;">{repo_name}</h3>
                        <p class="font-body" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6;">{description}</p>
                        <div class="project-tags">
{tags_html}
                        </div>
                        <a href="{github_url}" target="_blank" class="font-mono" style="font-size: 10px; color: var(--optimism-mint); text-decoration: none; display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem;">
                            VIEW_REPO <span class="material-symbols-outlined" style="font-size: 12px;">arrow_right_alt</span>
                        </a>
                    </div>"""
                    
    grid_start_marker = 'id="project-grid"'
    grid_start_pos = html.find(grid_start_marker)
    if grid_start_pos == -1:
        return html
    opening_tag_end = html.find('>', grid_start_pos) + 1
    return html[:opening_tag_end] + "\n" + card_html + html[opening_tag_end:]

def inject_timeline_node(html, repo_name, readme_content, api_key):
    category, label, tags = determine_metadata(repo_name)
    description = parse_readme_desc_text(readme_content, max_len=180)
    if api_key:
        prompt = f"Generate a brief technical milestone description (maximum 180 characters) for a portfolio timeline for the repository '{repo_name}' based on its README content: {readme_content[:1500]}. Focus on what was built, the stack used, and the goal."
        desc = generate_content_with_gemini(prompt, api_key)
        if desc:
            description = desc.replace('"', '').replace('\n', ' ')
            
    github_url = f"https://github.com/seeramsujay/{repo_name}"
    current_date = datetime.datetime.now().strftime("%b %Y")
    
    node_html = f"""
                    <div class="timeline-node left">
                        <div class="timeline-card-content glass-card">
                            <div class="flex justify-between items-start" style="margin-bottom: 1.5rem;">
                                <span class="font-mono" style="font-size: 10px; color: var(--optimism-mint);">{current_date} · {label}</span>
                            </div>
                            <h3 style="font-size: 1.75rem; font-style: italic; margin-bottom: 1rem;">{repo_name}</h3>
                            <p class="font-body" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 2rem;">
                                {description}
                            </p>
                            <div class="flex gap-6 font-mono" style="font-size: 10px; letter-spacing: 0.2em;">
                                <a href="{github_url}" target="_blank" style="color: var(--text-primary); text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1);">GITHUB</a>
                            </div>
                        </div>
                    </div>"""
                    
    timeline_start = html.find('<div class="timeline-container">')
    if timeline_start == -1:
        return html
        
    year_header = '<div class="timeline-year">2026</div>'
    year_pos = html.find(year_header, timeline_start)
    if year_pos != -1:
        insert_pos = year_pos + len(year_header)
    else:
        opening_tag_end = html.find('>', timeline_start) + 1
        year_html = f'\n                    <!-- 2026 -->\n                    <div class="timeline-year">2026</div>'
        html = html[:opening_tag_end] + year_html + html[opening_tag_end:]
        year_pos = html.find(year_header, timeline_start)
        insert_pos = year_pos + len(year_header)
        
    return html[:insert_pos] + "\n" + node_html + html[insert_pos:]

def inject_post_card(html, repo_name, readme_content, api_key):
    category, label, tags = determine_metadata(repo_name)
    title = f"Building {repo_name}"
    excerpt = parse_readme_desc_text(readme_content, max_len=140)
    full_text = f"Just open-sourced {repo_name}."
    tags_str = "#" + " #".join(tags)
    
    if api_key:
        prompt_title = f"Generate a short, engaging professional headline or title for a LinkedIn-style post about {repo_name} based on its README content: {readme_content[:1000]}."
        prompt_excerpt = f"Generate a one-sentence excerpt (maximum 150 characters) summarizing what was built in {repo_name} based on its README content: {readme_content[:1000]}."
        prompt_text = f"Write a short, engaging professional update/log (100-150 words) in the style of a developer's journal or LinkedIn post about building the project '{repo_name}' based on its README content: {readme_content[:1500]}. Start with a hook, discuss the engineering challenge or technical implementation, and end with relevant hashtags. Keep the tone authentic and use paragraph breaks."
        
        t = generate_content_with_gemini(prompt_title, api_key)
        exc = generate_content_with_gemini(prompt_excerpt, api_key)
        ft = generate_content_with_gemini(prompt_text, api_key)
        
        if t: title = t.replace('"', '').replace('\n', ' ')
        if exc: excerpt = exc.replace('"', '').replace('\n', ' ')
        if ft: full_text = ft
        
    full_text_br = full_text.replace('\n', '<br>')
    escaped_full_text = full_text.replace('`', '\\`').replace('"', '\\"').replace('\n', '<br>')
    escaped_title = title.replace('`', '\\`').replace('"', '\\"')
    
    post_html = f"""
                        <article class="post-card glass-card">
                            <div class="post-card-inner" onclick="togglePost(this)">
                                <div class="post-meta">
                                    <span>{repo_name.upper()} 🚀 // LOG</span>
                                </div>
                                <h3 class="post-title">{title}</h3>
                                <p class="post-excerpt">{excerpt}</p>
                                <div class="post-read-more">
                                    <span class="material-symbols-outlined" style="font-size: 16px;">unfold_more</span>
                                    <span>Read Full Log</span>
                                </div>
                            </div>
                            <div class="post-content">
                                <div class="post-body">
                                    <div class="post-text">
                                        {full_text_br}
                                    </div>
                                    <div class="post-tags">{tags_str}</div>
                                    <div class="post-footer" style="margin-top: 2rem; display: flex; gap: 1.5rem;">
                                        <button class="filter-btn" onclick="copyPostText(this, `{escaped_full_text}`)">
                                            <span class="font-metadata">Copy Text</span>
                                        </button>
                                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=https://github.com/seeramsujay&title={escaped_title}"
                                            target="_blank" class="filter-btn" style="text-decoration: none;">
                                            <span class="font-metadata">Post to LinkedIn ↗</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </article>"""
                        
    ptr = 0
    while True:
        posts_start = html.find('<section id="posts"', ptr)
        if posts_start == -1:
            posts_start = html.find('id="posts"', ptr)
            if posts_start == -1:
                break
            posts_start = html.rfind('<section', 0, posts_start)
            if posts_start == -1:
                break
                
        posts_end = find_matching_tag(html, posts_start, 'section')
        if posts_end == -1:
            break
            
        art_pos = html.find('<article', posts_start, posts_end)
        if art_pos != -1:
            html = html[:art_pos] + post_html + "\n\n" + html[art_pos:]
            posts_end += len(post_html) + 2
        else:
            html = html[:posts_end-10] + post_html + html[posts_end-10:]
            posts_end += len(post_html)
            
        ptr = posts_end
        
    return html

def run():
    print("=" * 60)
    print("PORTFOLIO SYSTEM VAULT MANAGER")
    print("=" * 60)
    
    if not os.path.isfile(index_path):
        print(f"Error: index.html not found at {index_path}")
        return
        
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
        
    public_repos, private_repos = load_repos()
    
    api_key = os.environ.get("GEMINI_API_KEY", "").strip() or None
    if api_key:
        print("GEMINI_API_KEY found! Enabling Gemini API for descriptions and logs generation.")
    else:
        print("GEMINI_API_KEY not set. Using fallback local templates.")

    # ─── 1. VERIFY AND INJECT PUBLIC REPOSITORIES ─────────────────────────────
    print("\n--- Scanning and Injecting Public Repositories ---")
    for repo in sorted(list(public_repos)):
        # Skip general sujayseeram repository (it is this portfolio repository itself)
        if repo.lower() in ["sujayseeram", "suzaykid"]:
            continue
            
        in_vault = check_exists_in_vault(html, repo)
        in_timeline = check_exists_in_timeline(html, repo)
        in_posts = check_exists_in_posts(html, repo)
        
        needs_vault = not in_vault
        needs_timeline = not in_timeline
        needs_posts = not in_posts
        
        if needs_vault or needs_timeline or needs_posts:
            print(f"\n[NEW DETECTED] Public repo '{repo}' has missing cards:")
            if needs_vault: print(" - Missing in Vault Grid")
            if needs_timeline: print(" - Missing in Timeline")
            if needs_posts: print(" - Missing in Posts/Chronicle")
            
            readme = get_readme_content(repo)
            
            if needs_vault:
                html = inject_vault_card(html, repo, readme, api_key)
                print(f" -> Injected Vault Card for '{repo}'")
            if needs_timeline:
                html = inject_timeline_node(html, repo, readme, api_key)
                print(f" -> Injected Timeline Node for '{repo}'")
            if needs_posts:
                html = inject_post_card(html, repo, readme, api_key)
                print(f" -> Injected LinkedIn Post Card for '{repo}'")
        else:
            print(f"[OK] Cards already exist for public repo '{repo}'")

    # ─── 2. CLEAN PRIVATE PROJECT REFERENCES (THE "NUKE" STEP) ─────────────────
    print("\n--- Cleaning Up Private Project References ---")
    
    # Filter Vault
    grid_start_marker = 'id="project-grid"'
    grid_start_pos = html.find(grid_start_marker)
    if grid_start_pos != -1:
        grid_div_start = html.rfind('<div', 0, grid_start_pos)
        if grid_div_start == -1:
            grid_div_start = grid_start_pos
        grid_end = find_matching_tag(html, grid_div_start, 'div')
        if grid_end != -1:
            opening_tag_end = html.find('>', grid_div_start) + 1
            # find the actual closing </div> to preserve it correctly
            close_tag = '</div>'
            close_tag_pos = html.rfind(close_tag, opening_tag_end, grid_end)
            if close_tag_pos == -1:
                close_tag_pos = grid_end
            grid_interior = html[opening_tag_end:close_tag_pos].strip()

            cards = []
            card_blocks = grid_interior.split('<div class="project-item')
            for block in card_blocks[1:]:
                if not block.strip():
                    continue
                block = '<div class="project-item' + block
                url_match = re.search(r'href="([^"]+)"', block)
                url = url_match.group(1) if url_match else ""
                title_match = re.search(r'<h3[^>]*>([^<]+)</h3>', block)
                title = title_match.group(1).strip() if title_match else ""
                repo_name = url.rstrip('/').split('/')[-1] if url else ""

                cards.append({"title": title, "url": url, "repo_name": repo_name, "block": block})

            public_cards = []
            for card in cards:
                if is_card_repo_public(card):
                    public_cards.append(card)
                else:
                    print(f"[NUKE VAULT] Removing private vault card: '{card['title']}' ({card['repo_name']})")

            rebuilt_grid = "\n\n".join([c["block"] for c in public_cards])
            html = html[:opening_tag_end] + "\n" + rebuilt_grid + "\n                    " + html[close_tag_pos:]

    # Filter Timeline
    timeline_start = html.find('<div class="timeline-container">')
    if timeline_start != -1:
        timeline_end = find_matching_tag(html, timeline_start, 'div')
        if timeline_end != -1:
            timeline_content = html[timeline_start:timeline_end]
            opening_tag_end = timeline_content.find('>') + 1
            close_tag_pos_tl = timeline_content.rfind('</div>')
            if close_tag_pos_tl == -1:
                close_tag_pos_tl = len(timeline_content)
            timeline_interior = timeline_content[opening_tag_end:close_tag_pos_tl].strip()
            
            ptr = 0
            elements = []
            while ptr < len(timeline_interior):
                next_year = timeline_interior.find('<div class="timeline-year"', ptr)
                next_node = timeline_interior.find('<div class="timeline-node', ptr)
                if next_year == -1 and next_node == -1: break
                
                if next_year != -1 and (next_node == -1 or next_year < next_node):
                    year_end = find_matching_tag(timeline_interior, next_year, 'div')
                    if year_end == -1: break
                    elements.append(('year', timeline_interior[next_year:year_end]))
                    ptr = year_end
                else:
                    node_end = find_matching_tag(timeline_interior, next_node, 'div')
                    if node_end == -1: break
                    elements.append(('node', timeline_interior[next_node:node_end]))
                    ptr = node_end
                    
            filtered_elements = []
            for el in elements:
                if el[0] == 'node':
                    if is_node_public(el[1], public_repos, private_repos):
                        filtered_elements.append(el)
                    else:
                        title_match = re.search(r'<h3[^>]*>([^<]+)</h3>', el[1])
                        title = title_match.group(1).strip() if title_match else "Unknown Node"
                        print(f"[NUKE TIMELINE] Removing private timeline node: '{title}'")
                else:
                    filtered_elements.append(el)
                    
            final_elements = []
            for i, el in enumerate(filtered_elements):
                if el[0] == 'year':
                    has_node = False
                    for j in range(i + 1, len(filtered_elements)):
                        if filtered_elements[j][0] == 'year': break
                        if filtered_elements[j][0] == 'node':
                            has_node = True
                            break
                    if has_node: final_elements.append(el)
                else:
                    final_elements.append(el)
                    
            is_left = True
            for i, el in enumerate(final_elements):
                if el[0] == 'node':
                    node_html = el[1]
                    node_html = re.sub(
                        r'class="timeline-node\s+(left|right)"',
                        f'class="timeline-node {"left" if is_left else "right"}"',
                        node_html
                    )
                    final_elements[i] = ('node', node_html)
                    is_left = not is_left
                    
            rebuilt_timeline = "\n\n".join([el[1] for el in final_elements]).strip()
            closing_tl = timeline_content[close_tag_pos_tl:]
            new_timeline_content = timeline_content[:opening_tag_end] + "\n                    " + rebuilt_timeline + "\n" + closing_tl
            html = html[:timeline_start] + new_timeline_content + html[timeline_end:]

    # Filter Posts
    ptr = 0
    num_posts_remaining = 0
    while True:
        posts_start = html.find('<section id="posts"', ptr)
        if posts_start == -1:
            posts_start = html.find('id="posts"', ptr)
            if posts_start == -1: break
            posts_start = html.rfind('<section', 0, posts_start)
            if posts_start == -1: break
            
        posts_end = find_matching_tag(html, posts_start, 'section')
        if posts_end == -1: break
        
        posts_content = html[posts_start:posts_end]
        opening_tag_end = posts_content.find('>') + 1
        
        articles = []
        art_ptr = 0
        while True:
            art_start = posts_content.find('<article', art_ptr)
            if art_start == -1: break
            art_end = find_matching_tag(posts_content, art_start, 'article')
            if art_end == -1: break
            articles.append((art_start, art_end, posts_content[art_start:art_end]))
            art_ptr = art_end
            
        kept_articles = []
        for start, end, art_html in articles:
            if is_node_public(art_html, public_repos, private_repos):
                kept_articles.append(art_html)
            else:
                title_match = re.search(r'<h3[^>]*>([^<]+)</h3>', art_html)
                title = title_match.group(1).strip() if title_match else "Unknown Post"
                print(f"[NUKE POST] Removing private post card: '{title}'")
                
        if articles:
            first_art_start = articles[0][0]
            last_art_end = articles[-1][1]
            rebuilt_articles = "\n\n".join(kept_articles)
            new_posts_content = posts_content[:first_art_start] + rebuilt_articles + posts_content[last_art_end:]
        else:
            new_posts_content = posts_content
            
        html = html[:posts_start] + new_posts_content + html[posts_end:]
        new_posts_end = posts_start + len(new_posts_content)
        ptr = new_posts_end
        num_posts_remaining = len(kept_articles)

    # Update HUD LOGGED_ENTRIES stats (only if we actually processed posts sections)
    if num_posts_remaining > 0:
        html = re.sub(
            r'(<span class="hud-label">LOGGED_ENTRIES</span>\s*<span class="hud-value">)\d+(</span>)',
            rf'\g<1>{num_posts_remaining}\g<2>',
            html
        )

    # Filter Terminal Grid active list
    term_grid_start = html.find('<div class="terminal-grid">')
    if term_grid_start != -1:
        term_grid_end = find_matching_tag(html, term_grid_start, 'div')
        if term_grid_end != -1:
            term_grid_content = html[term_grid_start:term_grid_end]
            opening_tag_end = term_grid_content.find('>') + 1
            close_tag_pos_tg = term_grid_content.rfind('</div>')
            if close_tag_pos_tg == -1:
                close_tag_pos_tg = len(term_grid_content)

            items = []
            tg_ptr = 0
            while True:
                item_start = term_grid_content.find('<div>', tg_ptr)
                if item_start == -1:
                    break
                item_end = find_matching_tag(term_grid_content, item_start, 'div')
                if item_end == -1:
                    break
                items.append(term_grid_content[item_start:item_end])
                tg_ptr = item_end

            kept_items = []
            for item in items:
                item_lower = item.lower()
                is_private = False
                for repo in private_repos:
                    if repo.lower() == 'ai-based-pid-tuning-controller' and 'ai-pid-tuner' in item_lower:
                        is_private = True
                        break
                    if repo.lower() == 'smart-home-assistant-framework' and 'smart-home-assistant' in item_lower:
                        is_private = True
                        break
                    pattern   = r'\b' + re.escape(repo.lower()) + r'\b'
                    alt_pat1  = r'\b' + re.escape(repo.lower().replace('-', ' ')) + r'\b'
                    alt_pat2  = r'\b' + re.escape(repo.lower().replace('-', '_')) + r'\b'
                    if re.search(pattern, item_lower) or re.search(alt_pat1, item_lower) or re.search(alt_pat2, item_lower):
                        is_private = True
                        break
                if not is_private:
                    kept_items.append(item)
                else:
                    print(f"[NUKE TERMINAL ITEM] Removing private active project: '{item}'")

            rebuilt_tg = "\n                ".join(kept_items)
            closing_tg = term_grid_content[close_tag_pos_tg:]
            new_term_grid_content = (term_grid_content[:opening_tag_end]
                                     + "\n                " + rebuilt_tg
                                     + "\n            " + closing_tg)
            html = html[:term_grid_start] + new_term_grid_content + html[term_grid_end:]

    # Write back to index.html
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html)
        
    print("\n" + "=" * 60)
    print("SUCCESS: index.html has been fully updated and cleaned!")
    print("=" * 60)

if __name__ == "__main__":
    run()
