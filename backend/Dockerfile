# Stage 1: Build stage
FROM python:3.11-slim-bookworm as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install dependencies into local directory
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime stage
FROM python:3.11-slim-bookworm

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application code (excluding files in .dockerignore if any, and do not rely on .env)
COPY . .

# Ensure the local bin is in PATH
ENV PATH=/root/.local/bin:$PATH

# Default port environment variable
ENV PORT=8000

EXPOSE $PORT

# Run application using the configured port
CMD uvicorn src.main:app --host 0.0.0.0 --port $PORT
