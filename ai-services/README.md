# AI Services (Python RAG backend)

This folder contains a FastAPI service that builds a retrieval-augmented
chatbot using LangChain and Google/ Gemini models. **This service is
*not* required for the React frontend unless you explicitly configure it
to use `/ask` instead of the Node/Express intent engine.**

## Setup

1. create / activate a virtual environment in this directory:

   ```bash
   cd ai-services
   python -m venv venv               # Windows: `python -m venv venv`
   venv\Scripts\activate           # PowerShell/cmd
   # on macOS/Linux: `source venv/bin/activate`
   ```

2. install dependencies (make sure the virtual environment is activated!):

   ```bash
   # activate first (Windows shown here):
   venv\Scripts\activate

   pip install --upgrade pip
   pip install -r requirements.txt
   ```

   After running these commands you can verify the installation via
   `pip list` – you should see `langchain` (>=0.1.4) in the output.  The
   requirements file pins a recent version that provides `langchain.chains`.
   If you already have an existing install you can also upgrade explicitly:
   `pip install --upgrade "langchain>=0.1.4,<2.0"`.

3. set environment variables in a `.env` file or your shell:

   ```ini
   GEMINI_API_KEY=...      # Google Gemini key
   VECTOR_DB_PATH=vector_store  # default location of Chroma DB
   ```

4. start the server:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Common error

If you see `ModuleNotFoundError: No module named 'langchain.chains'`,
that means the virtual environment does not have a compatible version of
LangChain installed.  Activate the `venv` and run the install commands
above.

## Usage

The service exposes a POST endpoint at `/ask` which accepts JSON:

```json
{ "question": "What are the auction rules?" }
```

and returns

```json
{ "answer": "…" }
```

You can verify the service from a shell with curl:

```bash
# from the ai-services folder, run
curl -X POST http://localhost:8000/ask \
  -H 'Content-Type: application/json' \
  -d '{"question":"hello"}'
```

A successful response demonstrates that the FastAPI server is running and
listening.  Point the React frontend at this URL by setting
`VITE_CHAT_URL=http://localhost:8000/ask` (or `VITE_API_BASE` the base URL).
Otherwise the frontend defaults to the Node-based intent engine located in
`chatbot/backend`.
