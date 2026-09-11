from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

from .config import VECTOR_DB_PATH, GEMINI_API_KEY


class ChainWrapper:
    def __init__(self, chain):
        self.chain = chain
        
    def run(self, question: str) -> str:
        return self.chain.invoke(question)


def get_chain():
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-2",
        api_key=GEMINI_API_KEY
    )

    vectordb = Chroma(
        persist_directory=VECTOR_DB_PATH,
        embedding_function=embeddings
    )

    retriever = vectordb.as_retriever(search_kwargs={"k": 3})

    llm = ChatGoogleGenerativeAI(
        model="models/gemini-2.5-flash",
        temperature=0,
        api_key=GEMINI_API_KEY
    )

    template = """Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

{context}

Question: {question}
Answer:"""
    prompt = PromptTemplate.from_template(template)

    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    qa_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )

    return ChainWrapper(qa_chain)
