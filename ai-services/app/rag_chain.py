from langchain_community.vectorstores import Chroma
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA
from config import VECTOR_DB_PATH, GEMINI_API_KEY

def get_chain():
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        api_key=GEMINI_API_KEY
    )
    vectordb = Chroma(
        persist_directory=VECTOR_DB_PATH,
        embedding_function=embeddings
    )

    retriever = vectordb.as_retriever(search_kwargs={"k": 3})

    llm = ChatOpenAI(
        model_name="models/text-bison-001",  # Gemini chat model
        temperature=0
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
        return_source_documents=False
    )

    return qa_chain
