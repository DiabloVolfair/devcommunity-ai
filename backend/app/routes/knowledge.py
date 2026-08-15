"""Knowledge base routes."""

from typing import Optional

from fastapi import APIRouter, HTTPException

from app.models.knowledge import (
    KnowledgeCreate,
    KnowledgeEntry,
    KnowledgeListResponse,
    KnowledgeSearchResponse,
)
from app.storage.knowledge_store import knowledge_store

router = APIRouter(prefix="/knowledge", tags=["knowledge"])


@router.post("/", response_model=KnowledgeEntry, status_code=201)
def create_knowledge(knowledge: KnowledgeCreate):
    """Save a solved problem as reusable community knowledge."""
    return knowledge_store.create(knowledge)


@router.get("/", response_model=KnowledgeListResponse)
def list_knowledge():
    """List all knowledge base entries."""
    entries = knowledge_store.list_all()
    return KnowledgeListResponse(entries=entries, total=knowledge_store.count())


@router.get("/search", response_model=KnowledgeSearchResponse)
def search_knowledge(q: str, technology: Optional[str] = None):
    """Search the knowledge base by keywords.

    - q: search query (keywords), use '*' to list all with optional tech filter
    - technology: optional filter by technology name
    """
    # Treat '*' or empty as "list all, just apply tech filter"
    if q.strip() == "*" or not q.strip():
        if technology:
            all_entries = knowledge_store.list_all()
            results = [e for e in all_entries if e.technology.lower() == technology.lower()]
        else:
            results = knowledge_store.list_all()
    else:
        results = knowledge_store.search(q, technology=technology)

    return KnowledgeSearchResponse(entries=results, query=q, total=len(results))


@router.get("/{entry_id}", response_model=KnowledgeEntry)
def get_knowledge(entry_id: str):
    """Get a specific knowledge entry by ID."""
    entry = knowledge_store.get(entry_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Knowledge entry not found")
    return entry
