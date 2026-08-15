"""Problem storage with JSON file persistence."""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from app.models.problem import (
    ProblemCreate,
    ProblemResponse,
    ProblemStatus,
    create_problem_id,
)

DATA_DIR = Path(__file__).parent.parent.parent / "data"
PROBLEMS_FILE = DATA_DIR / "problems.json"


class ProblemStore:
    """Problem storage with JSON file persistence."""

    def __init__(self):
        self._problems: dict[str, ProblemResponse] = {}
        self._load()

    def _load(self):
        """Load problems from JSON file if it exists."""
        if PROBLEMS_FILE.exists():
            try:
                raw = json.loads(PROBLEMS_FILE.read_text(encoding="utf-8"))
                for item in raw:
                    problem = ProblemResponse(**item)
                    self._problems[problem.id] = problem
            except (json.JSONDecodeError, Exception):
                pass

    def _save(self):
        """Persist all problems to JSON file."""
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        data = [p.model_dump(mode="json") for p in self._problems.values()]
        PROBLEMS_FILE.write_text(
            json.dumps(data, indent=2, default=str), encoding="utf-8"
        )

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
        self._save()
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
store = ProblemStore()
