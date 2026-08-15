"""Data models for technical problem submission."""

from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field


class ProblemStatus(str, Enum):
    """Status of a submitted problem."""

    PENDING = "pending"
    ANALYZING = "analyzing"
    SOLVED = "solved"
    UNRESOLVED = "unresolved"


class ProblemCreate(BaseModel):
    """Schema for creating a new technical problem."""

    technology: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Technology related to the problem (e.g., Docker, Git, AWS)",
        examples=["Docker", "Git", "AWS", "Python"],
    )
    title: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Brief title describing the problem",
        examples=["Docker container keeps restarting with exit code 137"],
    )
    description: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Detailed description of the problem",
    )
    error_message: Optional[str] = Field(
        default=None,
        max_length=3000,
        description="Error message or stack trace",
    )
    logs: Optional[str] = Field(
        default=None,
        max_length=5000,
        description="Relevant logs",
    )
    context: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Additional technical context (OS, versions, config, etc.)",
    )


class ProblemResponse(BaseModel):
    """Schema for returning a problem."""

    id: str = Field(description="Unique problem identifier")
    technology: str
    title: str
    description: str
    error_message: Optional[str] = None
    logs: Optional[str] = None
    context: Optional[str] = None
    status: ProblemStatus = ProblemStatus.PENDING
    created_at: datetime
    updated_at: datetime


class ProblemListResponse(BaseModel):
    """Schema for listing problems."""

    problems: list[ProblemResponse]
    total: int


def create_problem_id() -> str:
    """Generate a unique problem ID."""
    return str(uuid4())
