import os
from dotenv import load_dotenv

# Load .env from the same folder as config.py
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env file")

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "blockchain.txt")
VECTOR_DB_PATH = os.path.join(BASE_DIR, "vector_store")

# Chunking
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
