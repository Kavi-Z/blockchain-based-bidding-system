from google import genai
import os
from dotenv import load_dotenv
 
load_dotenv(os.path.join(os.path.dirname(__file__), "app", ".env"))

API_KEY = os.getenv("GEMINI_API_KEY")
print(f"API Key: {API_KEY[:15]}..." if API_KEY else "NO API KEY FOUND!")

try:
    client = genai.Client(api_key=API_KEY)
     
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello",
    )
    
    print(f"SUCCESS! Response: {response.text}")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")