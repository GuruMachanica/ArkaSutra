#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""ArkaSutra - 3D Spatial Solar Energy & Autonomous Rooftop Intelligence Engine"""

import os
import sys
import argparse
from datetime import datetime, timezone

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
for p in [CURRENT_DIR, ROOT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

try:
    from Backend.routers import topologies_router, satellite_router, solar_router, city_map_router, agent_router
except ImportError:
    from routers import topologies_router, satellite_router, solar_router, city_map_router, agent_router

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

app = FastAPI(title="ArkaSutra Spatial Solar Engine API", version="2.1.0", docs_url="/docs", redoc_url="/redoc")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; "
        "style-src 'self' 'unsafe-inline' https:; "
        "font-src 'self' https: data:; "
        "img-src 'self' data: https: blob:; "
        "connect-src 'self' https: http: ws: wss:;"
    )
    return response

app.include_router(topologies_router)
app.include_router(satellite_router)
app.include_router(solar_router)
app.include_router(city_map_router)
app.include_router(agent_router)

FRONTEND_DIST_DIR = os.path.join(ROOT_DIR, "Frontend", "dist")

@app.get("/api/health", tags=["System"])
def get_health():
    return {
        "status": "healthy", "service": "ArkaSutra Spatial Solar Engine",
        "version": "2.1.0", "timestamp": datetime.now(timezone.utc).isoformat(),
        "single_deployment_mode": os.path.exists(os.path.join(FRONTEND_DIST_DIR, "index.html"))
    }

if os.path.isdir(FRONTEND_DIST_DIR):
    assets_dir = os.path.join(FRONTEND_DIST_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join(FRONTEND_DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST_DIR, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend build index.html not found.")

def main():
    parser = argparse.ArgumentParser(description="ArkaSutra FastAPI Spatial Server")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)))
    parser.add_argument("--host", type=str, default="0.0.0.0")
    parser.add_argument("--reload", action="store_true")
    args, _ = parser.parse_known_args()
    uvicorn.run("server:app" if args.reload else app, host=args.host, port=args.port, reload=args.reload)

if __name__ == "__main__":
    main()
