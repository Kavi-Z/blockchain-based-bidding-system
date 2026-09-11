import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from .config import DATA_DIR, VECTOR_DB_PATH, CHUNK_SIZE, CHUNK_OVERLAP, GEMINI_API_KEY

def load_documents():
    """Load all text files in the data directory into a list of LangChain Document objects."""
    if not os.path.exists(DATA_DIR):
        raise FileNotFoundError(f"Data directory not found at {DATA_DIR}")
    
    docs = []
    for filename in os.listdir(DATA_DIR):
        if filename.endswith(".txt"):
            filepath = os.path.join(DATA_DIR, filename)
            with open(filepath, "r", encoding="utf-8") as file:
                text = file.read()
            docs.append(Document(page_content=text, metadata={"source": filename}))
    return docs

def split_text(documents):
    """Split documents into smaller chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    return splitter.split_documents(documents)

def main():
    print("Loading documents...")
    documents = load_documents()

    print("Splitting documents into chunks...")
    chunks = split_text(documents)
    print(f"Created {len(chunks)} chunks")

    print("Creating embeddings using Gemini API...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2",
        api_key=GEMINI_API_KEY
    )

    print("Creating Chroma vector database...")
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=VECTOR_DB_PATH
    )

    vectordb.persist()
    print("✅ Vector database created successfully!")

if __name__ == "__main__":
    main()
