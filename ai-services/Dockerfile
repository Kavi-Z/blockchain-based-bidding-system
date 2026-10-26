FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Default port for local runs; Railway overrides PORT at runtime
ENV PORT=8000
EXPOSE 8000

# Command to run the application (shell form so ${PORT} is expanded)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
