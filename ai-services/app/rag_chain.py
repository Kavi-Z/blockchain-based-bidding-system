
from app.config import VECTOR_DB_PATH, GEMINI_API_KEY


def get_chain():
    # Import heavy/optional dependencies lazily so the module can be imported
    # even if these packages are not installed in the environment.
    try:
        try:
            from langchain_community.vectorstores import Chroma
        except Exception:
            from langchain.vectorstores import Chroma

        try:
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
        except Exception:
            from langchain.embeddings import GoogleGenerativeAIEmbeddings

        try:
            from langchain_openai import ChatOpenAI
        except Exception:
            from langchain.chat_models import ChatOpenAI

        from langchain.chains import RetrievalQA
    except Exception as e:
        raise ImportError(
            "Required langchain libraries are not installed. "
            "Install dependencies from requirements.txt or adjust imports."
        ) from e

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
        model_name="gemini-1.5-flash",
        temperature=0
    )

    qa_chain = RetrievalQA(
        llm=llm,
        retriever=retriever,
        return_source_documents=False
    )

    return qa_chain
