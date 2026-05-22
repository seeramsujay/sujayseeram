#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import base64
import re
from datetime import datetime

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
        print("ERROR: GEMINI_API_KEY is not set in environment or .env file.")
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
            print(f"Initialized projects_db.json from backup.")
        else:
            with open(db_path, 'w', encoding='utf-8') as f:
                json.dump([], f)
    with open(db_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_db(projects):
    db_path = get_db_path()
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=4)
    print(f"Database saved to {db_path}")

def get_public_repos():
    print("Fetching public repositories from GitHub...")
    # Deprecation fix: use --visibility=public instead of --public
    cmd = ["gh", "repo list", "seeramsujay", "--visibility=public", "--json", "name,createdAt,description,url,isFork", "--limit", "100"]
    # gh CLI requires arguments to be split, let's use subprocess list
    try:
        res = subprocess.run(["gh", "repo", "list", "seeramsujay", "--visibility=public", "--json", "name,createdAt,description,url,isFork", "--limit", "100"],
                             capture_output=True, text=True, check=True)
        return json.loads(res.stdout)
    except Exception as e:
        print(f"Error calling gh CLI: {e}")
        sys.exit(1)

def get_readme_content(repo_name):
    print(f"Fetching README for {repo_name}...")
    try:
        res = subprocess.run(["gh", "api", f"repos/seeramsujay/{repo_name}/readme", "--jq", ".content"],
                             capture_output=True, text=True)
        if res.returncode == 0:
            b64_content = res.stdout.strip()
            return base64.b64decode(b64_content).decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Warning: could not fetch README for {repo_name}: {e}")
    return ""

def generate_metadata_with_gemini(repo_name, repo_desc, readme_content, api_key):
    print(f"Calling Gemini API to analyze {repo_name}...")
    try:
        import google.generativeai as genai
    except ImportError:
        print("ERROR: google-generativeai package is not installed.")
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
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    
    try:
        data = json.loads(response.text.strip())
        return data
    except Exception as e:
        text = response.text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```json\s*", "", text)
            text = re.sub(r"^```\s*", "", text)
            text = re.sub(r"\s*```$", "", text)
        try:
            return json.loads(text.strip())
        except Exception as e2:
            print(f"Error parsing Gemini response: {e2}")
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

def edit_project(project):
    print("\n" + "="*40)
    print("           EDIT PROJECT CARD")
    print("="*40)
    name = input(f"Project Name [{project['name']}]: ").strip() or project['name']
    date = input(f"Date [{project['date']}]: ").strip() or project['date']
    status = input(f"Status [{project['status']}]: ").strip() or project['status']
    category = input(f"Category (research/hardware/tool/hackathon) [{project['category']}]: ").strip() or project['category']
    
    tags_str = input(f"Tags (comma-separated) [{', '.join(project.get('tags', []))}]: ").strip()
    if tags_str:
        tags = [t.strip().upper() for t in tags_str.split(',') if t.strip()]
    else:
        tags = project.get('tags', [])
        
    description = input(f"Description [{project['description']}]: ").strip() or project['description']
    
    award_text = input(f"Award Text [{project.get('awardText') or 'None'}]: ").strip()
    if award_text.lower() in ('none', 'null', ''):
        award_text = None
        
    award_type = input(f"Award Type (gold/silver/participation) [{project.get('awardType') or 'None'}]: ").strip()
    if award_type.lower() in ('none', 'null', ''):
        award_type = None
        
    project['name'] = name
    project['date'] = date
    project['status'] = status
    project['category'] = category
    project['tags'] = tags
    project['description'] = description
    project['awardText'] = award_text
    project['awardType'] = award_type
    return project

def inject_data(projects_list):
    print("Injecting project details into index.html...")
    
    # Clean readmes mapping
    readmes_dict = {}
    projects_clean = []
    
    for p in projects_list:
        # Create a copy without the raw readme for projects array injection
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
        print("WARNING: Projects data markers not found in index.html!")
    
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
        print("WARNING: Project readmes markers not found in index.html!")
        
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("index.html updated successfully!")


def main():
    api_key = get_gemini_key()
    existing_projects = init_db()
    
    # Map by github link for easy lookup
    existing_by_link = {p['githubLink']: p for p in existing_projects}
    # Also maintain name index
    existing_by_name = {p['name']: p for p in existing_projects}
    
    repos = get_public_repos()
    
    new_additions = []
    db_updated = False
    
    for repo in repos:
        name = repo['name']
        url = repo['url']
        is_fork = repo['isFork']
        created_at = repo['createdAt']
        gh_desc = repo['description'] or ""
        
        # Check if already tracked
        if url in existing_by_link or name in existing_by_name:
            continue
            
        print("\n" + "-"*50)
        print(f"New repository found: {name}")
        print(f"URL: {url}")
        print(f"Fork: {is_fork}")
        print(f"Created: {created_at}")
        print(f"GitHub Description: {gh_desc}")
        print("-"*50)
        
        if is_fork:
            opt_in = input("This is a fork. Do you want to include it? (y/N): ").strip().lower()
            if opt_in != 'y':
                print(f"Skipping fork {name}.")
                # Store placeholder in DB with opted_out flag to avoid prompting again
                existing_projects.append({
                    "name": name,
                    "githubLink": url,
                    "opted_out": True
                })
                db_updated = True
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
            print("\nProposed Card Details:")
            print(f"  Name:        {project['name']}")
            print(f"  Date:        {project['date']}")
            print(f"  Status:      {project['status']}")
            print(f"  Category:    {project['category']}")
            print(f"  Tags:        {', '.join(project['tags'])}")
            print(f"  Description: {project['description']}")
            print(f"  Award Text:  {project['awardText']}")
            print(f"  Award Type:  {project['awardType']}")
            
            choice = input("\nOptions: [A]ccept, [E]dit, [R]eject/Skip: ").strip().lower()
            if choice == 'a':
                new_additions.append(project)
                existing_projects.append(project)
                db_updated = True
                print(f"Accepted {name}.")
                break
            elif choice == 'e':
                project = edit_project(project)
            else:
                print(f"Skipped {name}.")
                # Save as opted out
                existing_projects.append({
                    "name": name,
                    "githubLink": url,
                    "opted_out": True
                })
                db_updated = True
                break

    if db_updated:
        # Save to projects_db.json
        # Filter out temporary objects or keep them to prevent re-querying
        save_db(existing_projects)
        
    # Always update index.html to keep it synchronized with projects_db.json
    active_projects = [p for p in existing_projects if not p.get('opted_out')]
    inject_data(active_projects)

if __name__ == '__main__':
    main()
