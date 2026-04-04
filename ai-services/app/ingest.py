import os
 
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.vectorstores import Chroma
from langchain.embeddings import GoogleGenerativeAIEmbeddings
 

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from langchain.text_splitters import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain.vectorstores import Chroma
from langchain.embeddings import GoogleGenerativeAIEmbeddings




from config import DATA_PATH, VECTOR_DB_PATH, CHUNK_SIZE, CHUNK_OVERLAP, GEMINI_API_KEY


def load_document():
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(f"Data file not found at {DATA_PATH}")

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        text = f.read()

    return [Document(page_content=text)]


def split_text(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP
    )
    return splitter.split_documents(documents)


def main():
    print("📚 Loading documents...")
    documents = load_document()

    print("✂️ Splitting text...")
    chunks = split_text(documents)
    print(f"Created {len(chunks)} chunks")

    print("🧠 Creating Gemini embeddings...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        api_key=GEMINI_API_KEY
    )

    print("💾 Saving to Chroma DB...")
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=VECTOR_DB_PATH
    )

    vectordb.persist()
    print("✅ Ingestion complete!")


if __name__ == "__main__":
    main()
