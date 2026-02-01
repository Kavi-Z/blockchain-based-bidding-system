from fastapi import FastAPI
from pydantic import BaseModel
from rag_chain import get_chain

app = FastAPI()
qa_chain = get_chain()

class Query(BaseModel):
    question: str

@app.post("/ask")
def ask_question(query: Query):
    """
    Receive user question and return chatbot answer
    """
    answer = qa_chain.run(query.question)
    return {"answer": answer}
