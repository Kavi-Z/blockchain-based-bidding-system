from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .rag_chain import get_chain
from . import ingest

# The vector store is not committed, so build it on first start (e.g. a fresh Railway deploy)
if not ingest.vector_store_exists():
    print("Vector store not found; running ingestion...")
    ingest.main()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

qa_chain = get_chain()
# if get_chain returned the dummy fallback, print a reminder at startup
if hasattr(qa_chain, 'run') and qa_chain.__class__.__name__ == 'DummyChain':
    print("WARNING: LangChain not installed; chatbot will return an error message.")

class Query(BaseModel):
    message: str

@app.post("/api/chat/message")
def ask_question(query: Query):
    """
    Receive user question and return chatbot answer
    """
    answer = qa_chain.run(query.message)
    return {"answer": answer}
