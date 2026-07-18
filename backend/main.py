"""TalentPilot AI — FastAPI entrypoint."""

from __future__ import annotations

import sys
from pathlib import Path

# Ensure backend root is on sys.path for absolute imports
ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import router
from api.automation_routes import router as automation_router
from utils.config import get_settings

settings = get_settings()

app = FastAPI(
    title="TalentPilot AI",
    description="Agentic AI HR Recruitment Manager — multi-agent autonomous hiring pipeline",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(automation_router)


@app.get("/")
async def root():
    return {
        "name": "TalentPilot AI",
        "message": "The Future of Autonomous Recruitment",
        "docs": "/docs",
        "health": "/api/health",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
