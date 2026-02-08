from google import genai
import os
from dotenv import load_dotenv
 
load_dotenv(os.path.join(os.path.dirname(__file__), "app", ".env"))

API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key: {API_KEY[:15]}..." if API_KEY else "NO API KEY FOUND!")

try:
    client = genai.Client(api_key=API_KEY)
    
    print("\nAvailable Models:")
    print("=" * 50)
    
    for model in client.models.list():
        print(f"- {model.name}")
        
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")