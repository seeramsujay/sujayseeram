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

    if not api_key or api_key == 'your_gemini_api_key_here':
        print("Error: Valid GEMINI_API_KEY not found in environment or .env file.")
        print("Usage: python3 test_gemini_api.py [API_KEY]")
        print("Or set GEMINI_API_KEY in .env file (copy .env.example to .env).")
        sys.exit(1)

    masked_key = f"...{api_key[-6:]}" if len(api_key) > 6 else api_key
    print(f"Testing Gemini API Key (ending in {masked_key})")
    
    # 1. Try google.genai (modern SDK)
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        for model_name in ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash']:
            try:
                print(f"Connecting via google.genai with model '{model_name}'...")
                response = client.models.generate_content(model=model_name, contents="hi")
                print("\n--- Response ---")
                print(response.text.strip())
                print("----------------")
                print(f"\nSuccess! The Gemini API key is valid and working with '{model_name}'.")
                return
            except Exception as e:
                print(f"Notice: Model '{model_name}' could not be reached via google.genai: {e}")
    except ImportError:
        pass

    # 2. Try google.generativeai (legacy SDK)
    try:
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            import google.generativeai as legacy_genai
        legacy_genai.configure(api_key=api_key)
        for model_name in ['gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash']:
            try:
                print(f"Connecting via google.generativeai with model '{model_name}'...")
                model = legacy_genai.GenerativeModel(model_name)
                response = model.generate_content("hi")
                print("\n--- Response ---")
                print(response.text.strip())
                print("----------------")
                print(f"\nSuccess! The Gemini API key is valid and working with '{model_name}'.")
                return
            except Exception as e:
                print(f"Notice: Model '{model_name}' could not be reached via google.generativeai: {e}")
    except ImportError:
        print("Error: neither 'google-genai' nor 'google-generativeai' package is installed.")
        print("Run: uv sync  (or: pip install -r requirements.txt)")
        sys.exit(1)

    print("\nAPI Test Failed: All attempted models failed.")
    sys.exit(1)

if __name__ == '__main__':
    main()
