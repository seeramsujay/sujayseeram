#!/usr/bin/env python3
import os
import sys

def main():
    # Load .env if present
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    val = val.strip()
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    os.environ[key.strip()] = val

    # Get API key
    api_key = os.environ.get('GEMINI_API_KEY')
    if len(sys.argv) > 1:
        api_key = sys.argv[1]

    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment or .env file.")
        print("Usage: python3 test_gemini_api.py [API_KEY]")
        sys.exit(1)

    masked_key = f"...{api_key[-6:]}" if len(api_key) > 6 else api_key
    print(f"Testing Gemini API Key (ending in {masked_key})")
    
    try:
        import google.generativeai as genai
    except ImportError:
        print("Error: google-generativeai package is not installed. Run: pip install google-generativeai")
        sys.exit(1)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-3.1-flash-lite')
        print("Sending simple prompt: 'hi'...")
        response = model.generate_content("hi")
        print("\n--- Response ---")
        print(response.text.strip())
        print("----------------")
        print("\nSuccess! The Gemini API key is valid and working.")
    except Exception as e:
        print(f"\nAPI Test Failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
