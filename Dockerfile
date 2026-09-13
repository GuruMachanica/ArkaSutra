# =============================================================================
# SunMap Unified Single-Deployment Dockerfile
# Stage 1: Build React 18 / Three.js JavaScript Frontend
# Stage 2: Serve FastAPI REST Engine + Static WebGL Studio on a Single Port
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Frontend Build
# -----------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/Frontend

# Install build dependencies
COPY Frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Build Vite production assets
COPY Frontend/ ./
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Python 3.11 FastAPI Runtime
# -----------------------------------------------------------------------------
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000

WORKDIR /app

# Install system runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY Backend/requirements.txt ./Backend/
RUN pip install --no-cache-dir -r ./Backend/requirements.txt

# Copy Backend application and datasets
COPY Backend/ ./Backend/
COPY datasets/ ./datasets/


# Copy compiled Frontend distribution from builder
COPY --from=frontend-builder /app/Frontend/dist ./Frontend/dist

# Expose unified port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

# Launch FastAPI spatial engine (serving both API and WebGL Studio)
CMD ["uvicorn", "Backend.server:app", "--host", "0.0.0.0", "--port", "8000"]
