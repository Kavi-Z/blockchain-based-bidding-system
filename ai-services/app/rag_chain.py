from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_openai import ChatOpenAI

from config import VECTOR_DB_PATH, GEMINI_API_KEY


class DummyChain:
    """Fallback object used when langchain is not installed.

    The FastAPI app can still start, but any request will receive a helpful
    message instructing the developer to install the required packages.
    """
    def run(self, question: str) -> str:
        return (
            "⚠️ LangChain is not available in the Python environment. "
            "Please activate the `ai-services/venv` and run ``pip install -r "
            "requirements.txt`` (or upgrade LangChain to a compatible version)."
        )


def get_chain():
    """Return a RetrievalQA chain or a dummy stub.

    Imports the necessary classes lazily so that the module can be loaded even
    if langchain is missing.  If the import fails, a DummyChain instance is
    returned and the error is logged.
    """
    try:
        from langchain.chains import RetrievalQA
    except ModuleNotFoundError as err:
        # logging here isn't available; raise a message will be returned later
        return DummyChain()

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
        model_name="models/text-bison-001",
        temperature=0
    )

    qa_chain = RetrievalQA(
        llm=llm,
        retriever=retriever,
        return_source_documents=False
    )

    return qa_chain
