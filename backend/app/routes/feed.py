"""Combined feed endpoint — shows both problems and knowledge entries."""

from datetime import datetime
from typing import Literal, Optional

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.storage.knowledge_store import knowledge_store
from app.storage.memory_store import store

router = APIRouter(prefix="/feed", tags=["feed"])


class FeedItem(BaseModel):
    """A single feed item — either a problem or a knowledge entry."""

    id: str
    type: Literal["problem", "knowledge"]
    technology: str
    title: str
    description: str
    error_pattern: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    status: Optional[str] = None
    trust_score: Optional[float] = None
    validations_positive: int = 0
    validations_negative: int = 0
    created_at: datetime


class FeedResponse(BaseModel):
    """Feed response with mixed content."""

    items: list[FeedItem]
    total: int


@router.get("/", response_model=FeedResponse)
def get_feed():
    """Get the combined feed of problems and knowledge entries, newest first."""
    items: list[FeedItem] = []

    # Add knowledge entries
    for entry in knowledge_store.list_all():
        items.append(
            FeedItem(
                id=entry.id,
                type="knowledge",
                technology=entry.technology,
                title=entry.problem_title,
                description=entry.solution,
                error_pattern=entry.error_pattern,
                tags=entry.tags,
                status=None,
                trust_score=entry.trust_score,
                validations_positive=entry.validations_positive,
                validations_negative=entry.validations_negative,
                created_at=entry.created_at,
            )
        )

    # Add submitted problems
    for problem in store.list_problems():
        items.append(
            FeedItem(
                id=problem.id,
                type="problem",
                technology=problem.technology,
                title=problem.title,
                description=problem.description,
                error_pattern=problem.error_message,
                tags=[],
                status=problem.status,
                trust_score=None,
                validations_positive=0,
                validations_negative=0,
                created_at=problem.created_at,
            )
        )

    # Sort by creation date, newest first
    items.sort(key=lambda x: x.created_at, reverse=True)

    return FeedResponse(items=items, total=len(items))
