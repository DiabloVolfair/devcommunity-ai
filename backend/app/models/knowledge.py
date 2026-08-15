"""Data models for the community knowledge base."""

from datetime import datetime
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class KnowledgeCreate(BaseModel):
    """Schema for saving a solution as reusable knowledge."""

    technology: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Technology category (e.g., Docker, Git, AWS)",
    )
    problem_title: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Short title of the problem that was solved",
    )
    problem_description: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Description of the problem",
    )
    solution: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="The solution that resolved the problem",
    )
    error_pattern: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Common error message or pattern associated with this problem",
    )
    tags: list[str] = Field(
        default_factory=list,
        max_length=10,
        description="Tags for categorization (e.g., ['oom', 'memory', 'exit-code-137'])",
    )
    source_problem_id: Optional[str] = Field(
        default=None,
        description="ID of the original problem submission, if applicable",
    )


class KnowledgeEntry(BaseModel):
    """A stored knowledge base entry."""

    id: str = Field(description="Unique knowledge entry ID")
    technology: str
    problem_title: str
    problem_description: str
    solution: str
    error_pattern: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    source_problem_id: Optional[str] = None
    validations_positive: int = Field(default=0, description="Number of positive validations")
    validations_negative: int = Field(default=0, description="Number of negative validations")
    trust_score: float = Field(default=0.0, description="Community trust score (0-100)")
    created_at: datetime
    updated_at: datetime


class KnowledgeListResponse(BaseModel):
    """Schema for listing knowledge entries."""

    entries: list[KnowledgeEntry]
    total: int


class KnowledgeSearchResponse(BaseModel):
    """Schema for search results with relevance info."""

    entries: list[KnowledgeEntry]
    query: str
    total: int


def create_knowledge_id() -> str:
    """Generate a unique knowledge entry ID."""
    return str(uuid4())
