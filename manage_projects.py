#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import base64
import re
import shutil
from datetime import datetime

# ANSI Colors
COLORS = {
    'cyan': '\033[96m',
    'green': '\033[92m',
    'yellow': '\033[93m',
    'red': '\033[91m',
    'magenta': '\033[95m',
    'bold': '\033[1m',
    'reset': '\033[0m'
}

def color_text(text, color):
    if sys.stdout.isatty():
        return f"{COLORS.get(color, '')}{text}{COLORS['reset']}"
    return text

def clear_screen():
    if sys.stdout.isatty():
        print('\033[H\033[2J', end='')
    else:
        print("\n" + "="*80 + "\n")

def print_box_header(title):
    width = 65
    title_len = len(title)
    padding = max(0, (width - title_len - 2) // 2)
    left_pad = " " * padding
    right_pad = " " * max(0, width - title_len - 2 - padding)
    
    border_color = 'cyan'
    print(color_text("╔" + "═" * (width - 2) + "╗", border_color))
    print(color_text(f"║{left_pad}{color_text(title, 'bold')}{right_pad}║", border_color))
    print(color_text("╚" + "═" * (width - 2) + "╝", border_color))

def print_status(msg, status_type='info'):
    if status_type == 'info':
        prefix = color_text("[i]", "cyan")
    elif status_type == 'success':
        prefix = color_text("[✓]", "green")
    elif status_type == 'warning':
        prefix = color_text("[!]", "yellow")
    elif status_type == 'error':
        prefix = color_text("[✗]", "red")
    print(f"  {prefix} {msg}")

def load_env():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip()
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    if key not in os.environ:
                        os.environ[key] = val

def get_gemini_key(interactive=False):
    load_env()
    key = os.environ.get('GEMINI_API_KEY')
    if key and key != 'your_gemini_api_key_here':
        return key.strip()
    if interactive:
        try:
            print("\n" + "-" * 65)
            print_status("GEMINI_API_KEY is needed to analyze project READMEs with AI.", "info")
            entered_key = input("  Enter GEMINI_API_KEY (or press Enter to use repo defaults): ").strip()
            print("-" * 65 + "\n")
            if entered_key and entered_key != 'your_gemini_api_key_here':
                return entered_key
        except (EOFError, KeyboardInterrupt):
            pass
    return None

def get_github_username():
    return os.environ.get('GITHUB_USERNAME', 'seeramsujay')

def get_db_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'projects_db.json')

def init_db():
    db_path = get_db_path()
    if not os.path.exists(db_path):
        # Attempt to recover projects array from index.html if present
        html_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
        projects = []
        if os.path.exists(html_path):
            try:
                with open(html_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                start_proj = '// <!-- PROJECTS_DATA_START -->'
                end_proj = '// <!-- PROJECTS_DATA_END -->'
                start_idx = content.find(start_proj)
                end_idx = content.find(end_proj)
                if start_idx != -1 and end_idx != -1:
                    block = content[start_idx + len(start_proj):end_idx]
                    match = re.search(r'const\s+projects\s*=\s*(\[.*?\])\s*;', block, re.DOTALL)
                    if match:
                        projects = json.loads(match.group(1))
                        print_status("Initialized projects_db.json from index.html.", "success")
            except Exception as e:
                print_status(f"Could not extract existing projects from index.html: {e}", "warning")
        
        with open(db_path, 'w', encoding='utf-8') as f:
            json.dump(projects, f, indent=4)
        if not projects:
            print_status("Created new empty projects_db.json.", "info")

    with open(db_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_db(projects):
    db_path = get_db_path()
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4)
    print_status(f"Database saved to {db_path}", "success")

def get_public_repos():
    username = get_github_username()
    print_status(f"Fetching public repositories for @{username} from GitHub...", "info")
    try:
        res = subprocess.run(
            ["gh", "repo", "list", username, "--visibility=public", "--json", "name,createdAt,description,url,isFork", "--limit", "100"],
            capture_output=True, text=True, check=True
        )
        return json.loads(res.stdout)
    except FileNotFoundError:
        print_status("GitHub CLI ('gh') is not installed. Proceeding with existing local projects only.", "warning")
        return []
    except subprocess.CalledProcessError as e:
        err_msg = e.stderr.strip() if e.stderr else str(e)
        print_status(f"Warning: gh CLI error ({err_msg}). Proceeding with existing local projects only.", "warning")
        return []
    except Exception as e:
        print_status(f"Warning: Could not fetch GitHub repositories ({e}). Proceeding with existing database.", "warning")
        return []

def get_readme_content(repo_name):
    username = get_github_username()
    print_status(f"Fetching README for {repo_name}...", "info")
    try:
        res = subprocess.run(
            ["gh", "api", f"repos/{username}/{repo_name}/readme", "--jq", ".content"],
            capture_output=True, text=True
        )
        if res.returncode == 0:
            b64_content = res.stdout.strip()
            return base64.b64decode(b64_content).decode('utf-8', errors='ignore')
    except Exception as e:
        print_status(f"Warning: could not fetch README for {repo_name}: {e}", "warning")
    return ""

def _parse_json_response(raw_text):
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
    return json.loads(cleaned.strip())

def generate_metadata_with_gemini(repo_name, repo_desc, readme_content, api_key):
    default_metadata = {
        "status": "COMPLETED",
        "category": "tool",
        "tags": [],
        "description": (repo_desc or f"Portfolio project {repo_name}.")[:150],
        "awardText": None,
        "awardType": None
    }
    
    if not api_key:
        print_status("No Gemini API key provided. Using repository details for metadata.", "info")
        return default_metadata

    prompt = f"""
You are an expert developer portfolio assistant. Your task is to analyze the GitHub repository details and README content, and generate metadata suitable for a premium portfolio.

Repository Name: {repo_name}
GitHub Description: {repo_desc}

README Content:
{readme_content}

Strict JSON Schema to output:
{{
  "status": "A brief uppercase state, e.g., 'ACTIVE BUILD', 'COMPLETED', 'HACKATHON', 'UTILITY', 'OSS TOOL', 'SANDBOX'",
  "category": "One of: 'research', 'hardware', 'tool', 'hackathon'",
  "tags": ["An array of 2-4 uppercase tags of technologies used, e.g. ['PYTHON', 'VITE', 'REACT', 'ARDUINO']"],
  "description": "A refined, premium, 1-2 sentence description of the project (maximum 150 characters) designed to captivate visitors.",
  "awardText": "Any award or recognition text if mentioned in the README (e.g. '🏅 AMD Slingshot' or '🥈 2nd Place — IIT Madras Shaastra'). Null if none.",
  "awardType": "One of: 'gold', 'silver', 'participation'. Null if none."
}}

Response MUST be a single JSON object matching the schema.
"""

    print_status("Analyzing repository content with Gemini AI...", "info")

    # 1. Try modern google.genai SDK
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        for model_name in ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash']:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config={"response_mime_type": "application/json"}
                )
                if response and response.text:
                    return _parse_json_response(response.text)
            except Exception:
                continue
    except ImportError:
        pass

    # 2. Try legacy google.generativeai SDK
    try:
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        for model_name in ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash']:
            try:
                model = legacy_genai.GenerativeModel(model_name)
                response = model.generate_content(
                    prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                if response and response.text:
                    return _parse_json_response(response.text)
            except Exception:
                continue
    except Exception as e:
        print_status(f"Gemini analysis warning ({e}). Falling back to repository defaults.", "warning")

    return default_metadata

def format_date(created_at_str):
    try:
        dt = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%SZ")
        return dt.strftime("%b %Y")
    except Exception:
        return "Unknown"

def build_tui_projects(existing_projects, repos):
    existing_by_name = {p['name']: p for p in existing_projects}
    existing_by_link = {p['githubLink']: p for p in existing_projects if p.get('githubLink')}
    
    tui_projects = []
    added_names = set()
    
    for repo in repos:
        name = repo['name']
        url = repo['url']
        is_fork = repo.get('isFork', False)
        
        matched_project = existing_by_link.get(url) or existing_by_name.get(name)
        
        if matched_project:
            if matched_project.get('opted_out'):
                tui_state = 'D'
            elif matched_project.get('archived'):
                tui_state = 'A'
            elif matched_project.get('private') or not matched_project.get('githubLink'):
                tui_state = 'V'
            else:
                tui_state = 'P'
            tui_projects.append({
                "name": matched_project['name'],
                "githubLink": matched_project.get('githubLink', ''),
                "opted_out": matched_project.get('opted_out', False),
                "private": matched_project.get('private', False) or (not matched_project.get('githubLink') and not matched_project.get('opted_out') and not matched_project.get('archived')),
                "archived": matched_project.get('archived', False),
                "is_new": False,
                "is_fork": is_fork,
                "description": matched_project.get('description', ''),
                "category": matched_project.get('category', ''),
                "state": tui_state,
                "original_project": matched_project,
                "repo_url": url,
                "original_repo": repo
            })
            added_names.add(matched_project['name'])
        else:
            tui_state = 'D' if is_fork else 'P'
            tui_projects.append({
                "name": name,
                "githubLink": url,
                "opted_out": False,
                "private": False,
                "archived": False,
                "is_new": True,
                "is_fork": is_fork,
                "description": repo.get('description') or '',
                "category": 'tool',
                "state": tui_state,
                "original_project": None,
                "repo_url": url,
                "original_repo": repo
            })
            added_names.add(name)
            
    for p in existing_projects:
        if p['name'] not in added_names:
            if p.get('opted_out'):
                tui_state = 'D'
            elif p.get('archived'):
                tui_state = 'A'
            elif p.get('private') or not p.get('githubLink'):
                tui_state = 'V'
            else:
                tui_state = 'P'
            tui_projects.append({
                "name": p['name'],
                "githubLink": p.get('githubLink', ''),
                "opted_out": p.get('opted_out', False),
                "private": p.get('private', False) or (not p.get('githubLink') and not p.get('opted_out') and not p.get('archived')),
                "archived": p.get('archived', False),
                "is_new": False,
                "is_fork": False,
                "description": p.get('description', ''),
                "category": p.get('category', ''),
                "state": tui_state,
                "original_project": p,
                "repo_url": p.get('githubLink', '')
            })
            
    tui_projects.sort(key=lambda x: (not x['is_new'], x['name'].lower()))
    return tui_projects

def get_key():
    import sys
    if not sys.stdin.isatty():
        line = sys.stdin.readline()
        return line.strip() if line else 'q'
    
    import tty
    import termios
    import select
    fd = sys.stdin.fileno()
    try:
        old_settings = termios.tcgetattr(fd)
    except Exception:
        line = sys.stdin.readline()
        return line.strip() if line else 'q'

    try:
        tty.setraw(fd)
        ch = sys.stdin.read(1)
        if ch == '\x1b':
            rlist, _, _ = select.select([sys.stdin], [], [], 0.05)
            if rlist:
                ch2 = sys.stdin.read(1)
                if ch2 == '[':
                    rlist, _, _ = select.select([sys.stdin], [], [], 0.05)
                    if rlist:
                        ch3 = sys.stdin.read(1)
                        if ch3 == 'A': return 'up'
                        elif ch3 == 'B': return 'down'
                        elif ch3 == 'C': return 'right'
                        elif ch3 == 'D': return 'left'
            return 'esc'
        return ch
    finally:
        try:
            termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
        except Exception:
            pass

def run_tui(projects):
    selected_idx = 0
    start_idx = 0

    if not projects:
        clear_screen()
        print_box_header("PORTFOLIO MANAGER - NO PROJECTS FOUND")
        print("  No projects found in database or GitHub.")
        print("  Press any key to exit.")
        get_key()
        return 'quit'
    
    while True:
        try:
            terminal_size = os.get_terminal_size()
            term_height = terminal_size.lines
            term_width = terminal_size.columns
        except Exception:
            term_height = 24
            term_width = 80
            
        visible_count = term_height - 11
        if visible_count < 5:
            visible_count = 5
            
        selected_idx = max(0, min(selected_idx, len(projects) - 1))
        
        if selected_idx < start_idx:
            start_idx = selected_idx
        elif selected_idx >= start_idx + visible_count:
            start_idx = selected_idx - visible_count + 1
            
        clear_screen()
        print_box_header("PORTFOLIO MANAGER - PROJECT PUBLISHING CONTROL")
        print("  Use Up/Down or j/k to navigate.")
        print(f"  Actions: {color_text('[p]', 'green')} Public, {color_text('[v]', 'yellow')} Private, {color_text('[a]', 'cyan')} Archive, {color_text('[d]', 'red')} Nuke (Opt-out)")
        print(f"  Press {color_text('[s]', 'cyan')} to Save & Commit, or {color_text('[q]', 'bold')} to Quit without saving.")
        print("-" * term_width)
        
        end_idx = min(start_idx + visible_count, len(projects))
        for i in range(start_idx, end_idx):
            p = projects[i]
            is_selected = (i == selected_idx)
            
            state = p['state']
            if state == 'P':
                state_str = color_text("[ P ] Public ", "green")
            elif state == 'V':
                state_str = color_text("[ V ] Private", "yellow")
            elif state == 'A':
                state_str = color_text("[ A ] Archive", "cyan")
            else:
                state_str = color_text("[ D ] Nuked  ", "red")
                
            type_tag = ""
            if p['is_new']:
                type_tag = color_text("[NEW] ", "cyan")
            elif p['is_fork']:
                type_tag = color_text("[FORK]", "magenta")
            else:
                type_tag = "      "
                
            indicator = "-> " if is_selected else "   "
            name_display = p['name']
            if is_selected:
                name_display = color_text(name_display, "bold")
                line_content = f"{indicator}{state_str} {type_tag} {name_display}"
            else:
                line_content = f"{indicator}{state_str} {type_tag} {name_display}"
                
            print(line_content[:term_width])
            
        print("-" * term_width)
        
        count_p = sum(1 for x in projects if x['state'] == 'P')
        count_v = sum(1 for x in projects if x['state'] == 'V')
        count_a = sum(1 for x in projects if x['state'] == 'A')
        count_d = sum(1 for x in projects if x['state'] == 'D')
        
        status_line = f"  Total: {len(projects)} | {color_text('P', 'green')}: {count_p} | {color_text('V', 'yellow')}: {count_v} | {color_text('A', 'cyan')}: {count_a} | {color_text('D', 'red')}: {count_d}"
        print(status_line)
        
        if projects:
            sel_p = projects[selected_idx]
            p_desc = sel_p.get('description', 'No description.')
            wrapped_lines = []
            desc_limit = max(10, term_width - 8)
            for j in range(0, len(p_desc), desc_limit):
                wrapped_lines.append(p_desc[j:j+desc_limit])
            desc_disp = "\n            ".join(wrapped_lines[:2])
            if len(wrapped_lines) > 2:
                desc_disp += "..."
                
            print(f"  {color_text('Project:', 'yellow')} {sel_p['name']}")
            print(f"  {color_text('URL:', 'yellow')} {sel_p.get('githubLink') or sel_p.get('repo_url') or 'Local Secret'}")
            print(f"  {color_text('Desc:', 'yellow')} {desc_disp}")
            
        key = get_key()
        if not key:
            continue
            
        if key in ('up', 'k'):
            selected_idx = max(0, selected_idx - 1)
        elif key in ('down', 'j'):
            selected_idx = min(len(projects) - 1, selected_idx + 1)
        elif key == 'p':
            projects[selected_idx]['state'] = 'P'
        elif key == 'v':
            projects[selected_idx]['state'] = 'V'
        elif key == 'a':
            projects[selected_idx]['state'] = 'A'
        elif key == 'd':
            projects[selected_idx]['state'] = 'D'
        elif key == 's':
            clear_screen()
            print_box_header("CONFIRM PORTFOLIO COMMISSION")
            print(f"  {color_text('Public (P):', 'green'):<15} {count_p} projects (will be displayed on main timeline with GitHub links)")
            print(f"  {color_text('Private (V):', 'yellow'):<15} {count_v} projects (will be displayed on main timeline without GitHub links)")
            print(f"  {color_text('Archive (A):', 'cyan'):<15} {count_a} projects (will be moved to the Vault page)")
            print(f"  {color_text('Nuked (D):', 'red'):<15} {count_d} projects (will be hidden from the portfolio)")
            print("-" * 65)
            try:
                confirm = input("  Apply changes and update portfolio? (y/n): ").strip().lower()
                if confirm == 'y':
                    return 'save'
            except (EOFError, KeyboardInterrupt):
                return 'quit'
        elif key == 'q':
            clear_screen()
            print_box_header("QUIT WITHOUT SAVING")
            try:
                confirm = input("  Are you sure you want to discard all changes? (y/n): ").strip().lower()
                if confirm == 'y':
                    return 'quit'
            except (EOFError, KeyboardInterrupt):
                return 'quit'

def inject_data(projects_list):
    print_status("Injecting project details into index.html...", "info")
    
    # Clean readmes mapping
    readmes_dict = {}
    projects_clean = []
    
    for p in projects_list:
        p_copy = p.copy()
        readme_content = p_copy.pop('readme', '')
        projects_clean.append(p_copy)
        
        name = p['name']
        repo_key = 'Word-Association-Test-SSB-' if name == 'Word-Association-Test-SSB' else name
        readmes_dict[repo_key] = readme_content

    projects_json = json.dumps(projects_clean, indent=4)
    readmes_json = json.dumps(readmes_dict, indent=4)
    
    html_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
    if not os.path.exists(html_path):
        print_status(f"index.html not found at {html_path}", "warning")
        return

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Inject projects data
    start_proj = '// <!-- PROJECTS_DATA_START -->'
    end_proj = '// <!-- PROJECTS_DATA_END -->'
    start_idx = content.find(start_proj)
    end_idx = content.find(end_proj)
    if start_idx != -1 and end_idx != -1:
        end_idx += len(end_proj)
        old_proj_block = content[start_idx:end_idx]
        new_proj_block = f"{start_proj}\n        const projects = {projects_json};\n        {end_proj}"
        content = content.replace(old_proj_block, new_proj_block)
    else:
        print_status("Projects data markers not found in index.html!", "warning")
    
    # Inject readmes data
    start_readme = '// <!-- PROJECT_READMES_START -->'
    end_readme = '// <!-- PROJECT_READMES_END -->'
    start_idx = content.find(start_readme)
    end_idx = content.find(end_readme)
    if start_idx != -1 and end_idx != -1:
        end_idx += len(end_readme)
        old_readme_block = content[start_idx:end_idx]
        new_readme_block = f"{start_readme}\n        const projectReadmes = {readmes_json};\n        {end_readme}"
        content = content.replace(old_readme_block, new_readme_block)
    else:
        print_status("Project readmes markers not found in index.html!", "warning")
        
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print_status("index.html updated successfully!", "success")

def open_in_browser(file_path):
    print_status(f"Opening {os.path.basename(file_path)} in Zen browser...", "info")
    url = f"file://{os.path.abspath(file_path)}"
    
    zen_candidates = [
        os.path.expanduser("~/zen/zen"),
        os.path.expanduser("~/.local/bin/zen"),
        shutil.which("zen"),
        shutil.which("zen-browser"),
    ]
    for zen_cmd in zen_candidates:
        if zen_cmd and os.path.isfile(zen_cmd) and os.access(zen_cmd, os.X_OK):
            try:
                subprocess.Popen([zen_cmd, url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                print_status(f"Opened preview in Zen browser ({zen_cmd}).", "success")
                return
            except Exception as e:
                print_status(f"Could not launch Zen ({e}), trying system default...", "warning")
                break

    if shutil.which("xdg-open"):
        try:
            subprocess.Popen(["xdg-open", url], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print_status("Opened preview using system default browser (xdg-open).", "success")
            return
        except Exception:
            pass

    try:
        import webbrowser
        webbrowser.open(url)
        print_status("Opened preview using default browser.", "success")
    except Exception as e:
        print_status(f"Could not open browser automatically: {e}", "warning")
        print_status(f"Preview manually at: {url}", "info")

def git_commit_and_push():
    print_status("Preparing Git commit...", "info")
    repo_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        # Stage projects_db.json and index.html
        subprocess.run(
            ["git", "add", "projects_db.json", "index.html"],
            cwd=repo_dir, capture_output=True, text=True, check=True
        )
        
        # Check if there are staged differences
        res_diff = subprocess.run(
            ["git", "diff", "--staged", "--quiet"],
            cwd=repo_dir
        )
        if res_diff.returncode != 0:
            commit_msg = "update new projects"
            subprocess.run(
                ["git", "commit", "-m", commit_msg],
                cwd=repo_dir, capture_output=True, text=True, check=True
            )
            print_status(f"Committed changes: '{commit_msg}'", "success")
        else:
            print_status("No changes detected between working tree and HEAD to commit.", "info")
            
        print_status("Pushing changes to GitHub remote...", "info")
        res_push = subprocess.run(
            ["git", "push"],
            cwd=repo_dir, capture_output=True, text=True, check=True
        )
        print_status("Successfully pushed to GitHub!", "success")
        if res_push.stdout.strip():
            print(f"  {res_push.stdout.strip()}")
    except subprocess.CalledProcessError as e:
        err_msg = e.stderr.strip() if e.stderr else str(e)
        print_status(f"Git error: {err_msg}", "error")
    except Exception as e:
        print_status(f"Error during git commit & push: {e}", "error")

def main():
    clear_screen()
    print_box_header("PORTFOLIO SYNCHRONIZATION PIPELINE")
    
    api_key = get_gemini_key(interactive=False)
    if not api_key:
        print_status("GEMINI_API_KEY not set in environment or .env file.", "warning")
        print_status("Project browser will run in standard mode (no AI generation).", "info")
    else:
        print_status("GEMINI_API_KEY detected.", "success")
        
    existing_projects = init_db()
    repos = get_public_repos()
    
    print_status("Reconciling database projects and GitHub repositories...", "info")
    tui_projects = build_tui_projects(existing_projects, repos)
    
    action = run_tui(tui_projects)
    
    if action == 'save':
        clear_screen()
        print_box_header("SAVING AND COMMISSIONING CHANGES")
        
        # If new projects need ingestion and no api_key yet, prompt once
        has_new_published = any(item['is_new'] and item['state'] in ('P', 'V', 'A') for item in tui_projects)
        if has_new_published and not api_key:
            api_key = get_gemini_key(interactive=True)

        existing_by_name = {p['name']: p for p in existing_projects}
        db_updated = False
        
        for item in tui_projects:
            name = item['name']
            state = item['state']
            is_new = item['is_new']
            repo_url = item['repo_url']
            
            if is_new:
                if state in ('P', 'V', 'A'):
                    print_status(f"Ingesting new project: {name}", "info")
                    readme = get_readme_content(name)
                    repo_obj = item.get('original_repo') or {}
                    gh_desc = repo_obj.get('description') or ""
                    created_at = repo_obj.get('createdAt') or datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
                    
                    metadata = generate_metadata_with_gemini(name, gh_desc, readme, api_key)
                    
                    new_project = {
                        "name": name,
                        "date": format_date(created_at),
                        "status": metadata.get("status", "COMPLETED"),
                        "category": metadata.get("category", "tool"),
                        "tags": metadata.get("tags", []),
                        "description": metadata.get("description", gh_desc),
                        "githubLink": repo_url if state in ('P', 'A') else "",
                        "awardText": metadata.get("awardText"),
                        "awardType": metadata.get("awardType"),
                        "readme": readme
                    }
                    if state == 'V':
                        new_project['private'] = True
                    elif state == 'A':
                        new_project['archived'] = True
                    existing_projects.append(new_project)
                    db_updated = True
                    print_status(f"Successfully ingested {name}.", "success")
                else:
                    new_project = {
                        "name": name,
                        "githubLink": repo_url,
                        "opted_out": True
                    }
                    existing_projects.append(new_project)
                    db_updated = True
                    print_status(f"Skipped and marked {name} as opted-out.", "info")
            else:
                proj = existing_by_name.get(name)
                if proj:
                    original_opted_out = proj.get('opted_out', False)
                    original_private = proj.get('private', False)
                    original_archived = proj.get('archived', False)
                    original_link = proj.get('githubLink', '')
                    
                    target_opted_out = (state == 'D')
                    target_private = (state == 'V')
                    target_archived = (state == 'A')
                    
                    if state in ('P', 'A'):
                        target_link = repo_url or original_link
                    elif state == 'V':
                        target_link = ""
                    else:
                        target_link = original_link
                        
                    if (original_opted_out != target_opted_out or 
                        original_private != target_private or 
                        original_archived != target_archived or 
                        original_link != target_link):
                        
                        if target_opted_out:
                            proj['opted_out'] = True
                        else:
                            proj.pop('opted_out', None)
                            
                        if target_private:
                            proj['private'] = True
                        else:
                            proj.pop('private', None)
                            
                        if target_archived:
                            proj['archived'] = True
                        else:
                            proj.pop('archived', None)
                            
                        proj['githubLink'] = target_link
                        db_updated = True
                        print_status(f"Updated status of {name} to {state}.", "info")

        if db_updated:
            save_db(existing_projects)
        else:
            print_status("No changes were made to the project database.", "success")
            
        active_projects = [p for p in existing_projects if not p.get('opted_out')]
        inject_data(active_projects)
        
        # Open preview in Zen / default browser
        html_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')
        open_in_browser(html_path)
        
        # Prompt to commit and push
        print("\n" + "-" * 65)
        print_box_header("DEPLOYMENT & PUBLISHING")
        try:
            upload_confirm = input("  Upload and push changes to GitHub? (Y/n): ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            upload_confirm = 'n'
            
        if upload_confirm in ('', 'y', 'yes'):
            git_commit_and_push()
        else:
            print_status("Upload skipped. Changes remain saved locally.", "info")
    else:
        print_status("Quit. No changes saved.", "warning")

if __name__ == '__main__':
    main()
