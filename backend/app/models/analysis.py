"""Data models for AI troubleshooting analysis."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class AnalysisResponse(BaseModel):
    """Structured AI analysis of a technical problem."""

    problem_id: str = Field(description="ID of the analyzed problem")
    understanding: str = Field(
        description="AI's understanding of what the problem is"
    )
    likely_causes: list[str] = Field(
        description="List of likely causes for the problem"
    )
    recommended_solution: str = Field(
        description="Primary recommended solution"
    )
    troubleshooting_steps: list[str] = Field(
        description="Step-by-step troubleshooting guide"
    )
    additional_notes: Optional[str] = Field(
        default=None,
        description="Any extra context or warnings",
    )
    confidence: str = Field(
        description="AI confidence level: low, medium, or high"
    )
    analyzed_at: datetime = Field(description="Timestamp of the analysis")
