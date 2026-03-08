from fastapi import FastAPI
from pydantic import BaseModel
from app.rag_chain import get_chain

app = FastAPI()
qa_chain = get_chain()

# if get_chain returned the dummy fallback, print a reminder at startup
if hasattr(qa_chain, 'run') and qa_chain.__class__.__name__ == 'DummyChain':
    print("WARNING: LangChain not installed; chatbot will return an error message.")

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask_question(query: Query):
    """
    Receive user question and return chatbot answer
    """
    answer = qa_chain.run(query.question)
    return {"answer": answer}
