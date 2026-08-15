"""In-memory storage for problems. Simple dict-based store for MVP."""

from datetime import datetime, timezone
from typing import Optional

from app.models.problem import (
    ProblemCreate,
    ProblemResponse,
    ProblemStatus,
    create_problem_id,
)


class MemoryStore:
    """Simple in-memory storage using a dictionary."""

    def __init__(self):
        self._problems: dict[str, ProblemResponse] = {}

    def create_problem(self, problem: ProblemCreate) -> ProblemResponse:
        """Store a new problem and return it with generated metadata."""
        now = datetime.now(timezone.utc)
        problem_id = create_problem_id()

        stored = ProblemResponse(
            id=problem_id,
            technology=problem.technology,
            title=problem.title,
            description=problem.description,
            error_message=problem.error_message,
            logs=problem.logs,
            context=problem.context,
            status=ProblemStatus.PENDING,
            created_at=now,
            updated_at=now,
        )

        self._problems[problem_id] = stored
        return stored

    def get_problem(self, problem_id: str) -> Optional[ProblemResponse]:
        """Retrieve a problem by ID. Returns None if not found."""
        return self._problems.get(problem_id)

    def list_problems(self) -> list[ProblemResponse]:
        """Return all problems, newest first."""
        return sorted(
            self._problems.values(),
            key=lambda p: p.created_at,
            reverse=True,
        )

    def count(self) -> int:
        """Return total number of stored problems."""
        return len(self._problems)


# Singleton instance used across the app
store = MemoryStore()
