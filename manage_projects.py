#!/usr/bin/env python3
import os
import subprocess
import re
import json
import urllib.request

projects_dir = "/home/suzaykid/Projects"
index_path = "/home/suzaykid/Projects/sujayseeram/index.html"

_public_repos = None

def parse_github_repo(url):
    url = url.strip().rstrip('/')
    if url.endswith('.git'):
        url = url[:-4]
    
    # Match ssh or https format, e.g. git@github.com:owner/repo or https://github.com/owner/repo
    match = re.search(r'github\.com[:/]([^/]+)/([^/]+)$', url)
    if match:
        return match.group(1), match.group(2)
    return None

def load_public_repos():
    global _public_repos
    if _public_repos is not None:
        return _public_repos
        
    _public_repos = set()
    try:
        output = subprocess.check_output(
            ["gh", "repo", "list", "--limit", "100", "--source", "--json", "name,isPrivate"],
            stderr=subprocess.DEVNULL
        ).decode("utf-8").strip()
        repos = json.loads(output)
        for r in repos:
            if not r.get("isPrivate", True):
                _public_repos.add(r["name"].lower())
    except Exception:
        pass
    return _public_repos

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
    public_repos = load_public_repos()
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
    
    public_repos = load_public_repos()
    if name_lower in public_repos:
        return True
        
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

def find_matching_div(html, start_idx):
    idx = html.find('<div', start_idx)
    if idx == -1:
        return -1
    
    nest = 1
    ptr = idx + 4
    while nest > 0 and ptr < len(html):
        next_open = html.find('<div', ptr)
        next_close = html.find('</div>', ptr)
        
        if next_close == -1:
            break
            
        if next_open != -1 and next_open < next_close:
            nest += 1
            ptr = next_open + 4
        else:
            nest -= 1
            ptr = next_close + 6
            
    return ptr

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

def parse_readme_desc(readme_path, max_len=120):
    if not os.path.isfile(readme_path):
        return "Personal portfolio project."
    
    try:
        with open(readme_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        
        desc_lines = []
        for line in lines:
            line_str = line.strip()
            if not line_str:
                continue
            if line_str.startswith("#") or line_str.startswith("!") or line_str.startswith("[") or line_str.startswith("-") or line_str.startswith("*"):
                continue
            if "Licensing" in line_str or "Prohibitions" in line_str or "Copyright" in line_str:
                continue
            cleaned = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', line_str)
            cleaned = cleaned.replace("**", "").replace("__", "").replace("*", "").replace("_", "")
            desc_lines.append(cleaned)
            if len(desc_lines) >= 2:
                break
        
        desc = " ".join(desc_lines).strip()
        if len(desc) > max_len:
            desc = desc[:max_len-3] + "..."
        return desc if desc else "Personal portfolio project."
    except Exception:
        return "Personal portfolio project."

def determine_metadata(repo_path, repo_name):
    category = "tool"
    label = "UTILITY"
    tags = []
    
    has_python = False
    has_js_ts = False
    has_cpp_ino = False
    has_html_css = False
    has_jupyter = False
    
    for root, dirs, files in os.walk(repo_path):
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

def run():
    print("=" * 60)
    print("PORTFOLIO SYSTEM VAULT MANAGER")
    print("=" * 60)
    
    if not os.path.isfile(index_path):
        print(f"Error: index.html not found at {index_path}")
        return
        
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
        
    grid_start_marker = 'id="project-grid"'
    grid_start_pos = html.find(grid_start_marker)
    if grid_start_pos == -1:
        print("Error: Could not find project-grid container in index.html")
        return
        
    grid_div_start = html.rfind('<div', 0, grid_start_pos)
    grid_end = find_matching_div(html, grid_div_start)
    
    if grid_end == -1:
        print("Error: Could not find closing tag for project-grid")
        return
        
    grid_outer_html = html[grid_div_start:grid_end]
    opening_tag_end = html.find('>', grid_div_start) + 1
    grid_interior = html[opening_tag_end:grid_end-6].strip()
    
    cards = []
    card_blocks = grid_interior.split('<div class="project-item')
    for block in card_blocks[1:]:
        block_clean = block.strip()
        if not block_clean:
            continue
        block = '<div class="project-item ' + block.lstrip()
        
        url_match = re.search(r'href="([^"]+)"', block)
        url = url_match.group(1) if url_match else ""
        
        title_match = re.search(r'<h3[^>]*>([^<]+)</h3>', block)
        title = title_match.group(1).strip() if title_match else ""
        
        cat_match = re.search(r'data-category="([^"]+)"', block)
        category = cat_match.group(1) if cat_match else ""
        
        repo_name = url.rstrip('/').split('/')[-1] if url else ""
        
        cards.append({
            "title": title,
            "url": url,
            "repo_name": repo_name,
            "category": category,
            "block": block
        })
            
    print(f"Parsed {len(cards)} existing project cards from index.html.")
    
    print("\n--- Verifying & Filtering Cards ---")
    public_cards = []
    for card in cards:
        if is_card_repo_public(card):
            public_cards.append(card)
            if card["repo_name"]:
                print(f"[OK] Kept public project card: '{card['title']}' ({card['repo_name']})")
            else:
                print(f"[OK] Kept non-repository card: '{card['title']}'")
        else:
            print(f"[NUKE] Removing private project card: '{card['title']}' ({card['repo_name']})")
            
    print("\n--- Discovering New Repositories ---")
    new_repos = []
    existing_repo_names = {c["repo_name"].lower() for c in public_cards if c["repo_name"]}
    
    for d in sorted(os.listdir(projects_dir)):
        repo_path = os.path.join(projects_dir, d)
        if not os.path.isdir(repo_path) or d == "sujayseeram":
            continue
            
        git_path = os.path.join(repo_path, ".git")
        if os.path.isdir(git_path):
            if d.lower() not in existing_repo_names:
                if is_repo_public(repo_path):
                    new_repos.append(d)
                else:
                    print(f"[SKIP] Private or unverified repository ignored: {d}")
                
    new_cards_html = []
    if not new_repos:
        print("No new public repositories found under /home/suzaykid/Projects.")
    else:
        print(f"Found {len(new_repos)} new repositories: {', '.join(new_repos)}")
        
        for repo_name in new_repos:
            repo_path = os.path.join(projects_dir, repo_name)
            github_url = get_git_remote(repo_path, repo_name)
            readme_path = os.path.join(repo_path, "README.md")
            description = parse_readme_desc(readme_path)
            category, label, tags = determine_metadata(repo_path, repo_name)
            
            tags_html = "\n".join([f'                            <span class="tag">{t}</span>' for t in tags])
            
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
            new_cards_html.append(card_html)
            print(f"[NEW CARD] Auto-generated card for '{repo_name}' (Category: {category}, Label: {label}, Tags: {', '.join(tags)})")
            
    nuked_count = len(cards) - len(public_cards)
    changes_made = (nuked_count > 0) or (len(new_repos) > 0)
    
    if changes_made:
        # Rebuild the grid from the remaining public cards
        rebuilt_grid_interior = "\n\n".join([c["block"] for c in public_cards])
        
        # Combine with new cards
        if new_cards_html:
            combined_grid_interior = rebuilt_grid_interior + "\n" + "\n".join(new_cards_html)
        else:
            combined_grid_interior = rebuilt_grid_interior
            
        new_html = html[:opening_tag_end] + "\n" + combined_grid_interior + "\n                    " + html[grid_end-6:]
        
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(new_html)
            
        print("\n" + "=" * 60)
        print(f"SUCCESS: Rebuilt index.html! Nuked {nuked_count} private cards, added {len(new_repos)} new cards.")
        print("=" * 60)
    else:
        print("\nNo updates needed. All portfolio projects are verified public.")

if __name__ == "__main__":
    run()
