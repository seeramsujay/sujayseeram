#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import base64
import re
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
    padding = (width - title_len - 2) // 2
    left_pad = " " * padding
    right_pad = " " * (width - title_len - 2 - padding)
    
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
                    if key not in os.environ:
                        os.environ[key] = val.strip()

def get_gemini_key():
    load_env()
    key = os.environ.get('GEMINI_API_KEY')
    if not key or key == 'your_gemini_api_key_here':
        clear_screen()
        print_box_header("ERROR: CONFIGURATION MISSING")
        print_status("GEMINI_API_KEY is not set in environment or .env file.", "error")
        print("\n  Please set GEMINI_API_KEY and run again.")
        sys.exit(1)
    return key

def get_db_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'projects_db.json')

def init_db():
    db_path = get_db_path()
    if not os.path.exists(db_path):
        src_path = '/home/suzaykid/.gemini/antigravity/brain/c67151dd-61fc-4de3-a66b-955427176ba6/scratch/projects_extracted.json'
        if os.path.exists(src_path):
            import shutil
            shutil.copy(src_path, db_path)
            print_status(f"Initialized projects_db.json from backup.", "success")
        else:
            with open(db_path, 'w', encoding='utf-8') as f:
                json.dump([], f)
    with open(db_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_db(projects):
    db_path = get_db_path()
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4)
    print_status(f"Database saved to {db_path}", "success")

def get_public_repos():
    print_status("Fetching public repositories from GitHub...", "info")
    try:
        res = subprocess.run(["gh", "repo", "list", "seeramsujay", "--visibility=public", "--json", "name,createdAt,description,url,isFork", "--limit", "100"],
                             capture_output=True, text=True, check=True)
        return json.loads(res.stdout)
    except Exception as e:
        print_status(f"Error calling gh CLI: {e}", "error")
        sys.exit(1)

def get_readme_content(repo_name):
    print_status(f"Fetching README for {repo_name}...", "info")
    try:
        res = subprocess.run(["gh", "api", f"repos/seeramsujay/{repo_name}/readme", "--jq", ".content"],
                             capture_output=True, text=True)
        if res.returncode == 0:
            b64_content = res.stdout.strip()
            return base64.b64decode(b64_content).decode('utf-8', errors='ignore')
    except Exception as e:
        print_status(f"Warning: could not fetch README for {repo_name}: {e}", "warning")
    return ""

def generate_metadata_with_gemini(repo_name, repo_desc, readme_content, api_key):
    print_status(f"Analyzing repository content with Gemini 3.1 Flash Lite...", "info")
    try:
        import google.generativeai as genai
    except ImportError:
        print_status("google-generativeai package is not installed.", "error")
        sys.exit(1)

    genai.configure(api_key=api_key)
    
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
    model = genai.GenerativeModel('gemini-3.1-flash-lite')
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    
    try:
        data = json.loads(response.text.strip())
        return data
    except Exception:
        text = response.text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```json\s*", "", text)
            text = re.sub(r"^```\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
        try:
            return json.loads(text.strip())
        except Exception:
            return {
                "status": "COMPLETED",
                "category": "tool",
                "tags": [],
                "description": repo_desc or "Portfolio project.",
                "awardText": None,
                "awardType": None
            }

def format_date(created_at_str):
    try:
        dt = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%SZ")
        return dt.strftime("%b %Y")
    except Exception:
        return "Unknown"

def verify_private_repos(existing_projects, repos):
    public_urls = {r['url'].lower().strip() for r in repos}
    public_names = {r['name'].lower().strip() for r in repos}
    
    updated_projects = []
    db_updated = False
    
    for project in existing_projects:
        if project.get('opted_out'):
            updated_projects.append(project)
            continue
            
        link = project.get('githubLink')
        if not link:
            # Local archive, keep as-is
            updated_projects.append(project)
            continue
            
        repo_name = project['name'].lower().strip()
        if link.lower().strip() not in public_urls and repo_name not in public_names:
            # Private or deleted
            clear_screen()
            print_box_header(f"PRIVATE/DELETED REPOSITORY: {project['name']}")
            print_status(f"Repository URL: {link}", "warning")
            print_status("This repository is no longer in your public GitHub repository list.", "info")
            print("  It may have been deleted or set to private.")
            print("-" * 65)
            
            while True:
                choice = input(f"  Options: [{color_text('K', 'green')}]eep as Local Archive, [{color_text('R', 'red')}]emove from database: ").strip().lower()
                if choice == 'k':
                    project['githubLink'] = ""
                    updated_projects.append(project)
                    db_updated = True
                    print_status(f"Converted {project['name']} to a Local Archive.", "success")
                    input("\n  Press Enter to continue...")
                    break
                elif choice == 'r':
                    db_updated = True
                    print_status(f"Removed {project['name']} from database.", "success")
                    input("\n  Press Enter to continue...")
                    break
        else:
            updated_projects.append(project)
            
    return updated_projects, db_updated

def edit_project(project):
    clear_screen()
    print_box_header(f"EDIT PROJECT CARD: {project['name']}")
    print("  Leave field blank to keep current value.")
    print("-" * 65)
    
    name = input(f"  Name [{color_text(project['name'], 'cyan')}]: ").strip() or project['name']
    date = input(f"  Date [{color_text(project['date'], 'cyan')}]: ").strip() or project['date']
    status = input(f"  Status [{color_text(project['status'], 'cyan')}]: ").strip() or project['status']
    category = input(f"  Category (research/hardware/tool/hackathon) [{color_text(project['category'], 'cyan')}]: ").strip() or project['category']
    
    tags_curr = ', '.join(project.get('tags', []))
    tags_str = input(f"  Tags (comma-separated) [{color_text(tags_curr, 'cyan')}]: ").strip()
    if tags_str:
        tags = [t.strip().upper() for t in tags_str.split(',') if t.strip()]
    else:
        tags = project.get('tags', [])
        
    description = input(f"  Description [{color_text(project['description'][:45] + '...', 'cyan')}]: ").strip() or project['description']
    
    award_curr = project.get('awardText') or 'None'
    award_text = input(f"  Award Text [{color_text(str(award_curr), 'cyan')}]: ").strip()
    if award_text.lower() in ('none', 'null', ''):
        award_text = None
    elif not award_text and award_curr == 'None':
        award_text = None
    elif not award_text:
        award_text = project.get('awardText')
        
    award_type_curr = project.get('awardType') or 'None'
    award_type = input(f"  Award Type (gold/silver/participation) [{color_text(str(award_type_curr), 'cyan')}]: ").strip()
    if award_type.lower() in ('none', 'null', ''):
        award_type = None
    elif not award_type and award_type_curr == 'None':
        award_type = None
    elif not award_type:
        award_type = project.get('awardType')
        
    project['name'] = name
    project['date'] = date
    project['status'] = status
    project['category'] = category
    project['tags'] = tags
    project['description'] = description
    project['awardText'] = award_text
    project['awardType'] = award_type
    return project

def display_proposed_project(project):
    clear_screen()
    print_box_header(f"PROPOSED PORTFOLIO CARD: {project['name']}")
    
    print(f"  {color_text('Name:', 'yellow'):<15} {color_text(project['name'], 'bold')}")
    print(f"  {color_text('Date:', 'yellow'):<15} {project['date']}")
    print(f"  {color_text('Status:', 'yellow'):<15} {color_text(project['status'], 'cyan')}")
    print(f"  {color_text('Category:', 'yellow'):<15} {color_text(project['category'], 'magenta')}")
    print(f"  {color_text('Tags:', 'yellow'):<15} {', '.join(project['tags'])}")
    print(f"  {color_text('GitHub Link:', 'yellow'):<15} {project['githubLink']}")
    if project.get('awardText'):
        print(f"  {color_text('Award:', 'yellow'):<15} {color_text(project['awardText'], 'green')} ({project['awardType']})")
    print("-" * 65)
    print(f"  {color_text('Description:', 'bold')}")
    desc = project['description']
    wrapped_desc = "\n".join(f"    {desc[i:i+60]}" for i in range(0, len(desc), 60))
    print(wrapped_desc)
    print("-" * 65)

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

def main():
    api_key = get_gemini_key()
    
    clear_screen()
    print_box_header("PORTFOLIO SYNCHRONIZATION PIPELINE")
    
    existing_projects = init_db()
    
    # Map by github link for easy lookup
    existing_by_link = {p['githubLink']: p for p in existing_projects if p.get('githubLink')}
    # Also maintain name index
    existing_by_name = {p['name']: p for p in existing_projects}
    
    repos = get_public_repos()
    
    # Step 1: Verify for private or deleted repositories
    print_status("Verifying existing tracked projects against GitHub public repository list...", "info")
    existing_projects, db_updated = verify_private_repos(existing_projects, repos)
    
    # Refresh index mappings after verification cleanup
    existing_by_link = {p['githubLink']: p for p in existing_projects if p.get('githubLink')}
    existing_by_name = {p['name']: p for p in existing_projects}
    
    new_additions = []
    
    # Step 2: Iterate over fetched repos to check for new creations
    for repo in repos:
        name = repo['name']
        url = repo['url']
        is_fork = repo['isFork']
        created_at = repo['createdAt']
        gh_desc = repo['description'] or ""
        
        # Check if already tracked
        if url in existing_by_link or name in existing_by_name:
            continue
            
        clear_screen()
        print_box_header(f"NEW REPOSITORY DETECTED: {name}")
        print(f"  {color_text('URL:', 'yellow'):<15} {url}")
        print(f"  {color_text('Fork Status:', 'yellow'):<15} {'Yes' if is_fork else 'No'}")
        print(f"  {color_text('Created:', 'yellow'):<15} {created_at}")
        print(f"  {color_text('GitHub Desc:', 'yellow'):<15} {gh_desc}")
        print("-" * 65)
        
        if is_fork:
            opt_in = input(f"  This is a fork. Do you want to include it in the portfolio? ({color_text('y', 'green')}/{color_text('N', 'red')}): ").strip().lower()
            if opt_in != 'y':
                print_status(f"Skipping fork {name}.", "info")
                existing_projects.append({
                    "name": name,
                    "githubLink": url,
                    "opted_out": True
                })
                db_updated = True
                input("\n  Press Enter to continue...")
                continue
                
        # Fetch README and analyze
        readme = get_readme_content(name)
        metadata = generate_metadata_with_gemini(name, gh_desc, readme, api_key)
        
        project = {
            "name": name,
            "date": format_date(created_at),
            "status": metadata.get("status", "COMPLETED"),
            "category": metadata.get("category", "tool"),
            "tags": metadata.get("tags", []),
            "description": metadata.get("description", gh_desc),
            "githubLink": url,
            "awardText": metadata.get("awardText"),
            "awardType": metadata.get("awardType"),
            "readme": readme
        }
        
        # Confirm & Edit Loop
        while True:
            display_proposed_project(project)
            choice = input(f"  Options: [{color_text('A', 'green')}]ccept, [{color_text('E', 'yellow')}]dit, [{color_text('R', 'red')}]eject/Skip: ").strip().lower()
            if choice == 'a':
                new_additions.append(project)
                existing_projects.append(project)
                db_updated = True
                print_status(f"Accepted {name}.", "success")
                input("\n  Press Enter to continue...")
                break
            elif choice == 'e':
                project = edit_project(project)
            else:
                print_status(f"Skipped {name}.", "info")
                existing_projects.append({
                    "name": name,
                    "githubLink": url,
                    "opted_out": True
                })
                db_updated = True
                input("\n  Press Enter to continue...")
                break

    if db_updated:
        save_db(existing_projects)
    else:
        print_status("No new projects or database changes to save.", "success")
        
    # Always update index.html to keep it synchronized with projects_db.json
    active_projects = [p for p in existing_projects if not p.get('opted_out')]
    inject_data(active_projects)

if __name__ == '__main__':
    main()
