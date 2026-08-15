"""DevCommunity AI — Backend API entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router as analysis_router
from app.routes.feed import router as feed_router
from app.routes.knowledge import router as knowledge_router
from app.routes.problems import router as problems_router

app = FastAPI(
    title="DevCommunity AI",
    description="AI-powered community knowledge and troubleshooting for developers.",
    version="0.1.0",
)

# CORS — allow frontend dev server and common origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(problems_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(knowledge_router, prefix="/api")
app.include_router(feed_router, prefix="/api")


@app.get("/")
def root():
    """Health check / welcome endpoint."""
    return {
        "name": "DevCommunity AI",
        "version": "0.1.0",
        "status": "running",
    }
