import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "blockchain.txt")
VECTOR_DB_PATH = os.path.join(BASE_DIR, "vector_store")

# Chunking
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50

# Gemini API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
