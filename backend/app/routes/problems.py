"""Problem submission and retrieval routes."""

from fastapi import APIRouter, HTTPException

from app.models.problem import ProblemCreate, ProblemListResponse, ProblemResponse
from app.storage.memory_store import store

router = APIRouter(prefix="/problems", tags=["problems"])


@router.post("/", response_model=ProblemResponse, status_code=201)
def submit_problem(problem: ProblemCreate):
    """Submit a new technical problem for troubleshooting."""
    return store.create_problem(problem)


@router.get("/", response_model=ProblemListResponse)
def list_problems():
    """List all submitted problems."""
    problems = store.list_problems()
    return ProblemListResponse(problems=problems, total=store.count())


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: str):
    """Get a specific problem by ID."""
    problem = store.get_problem(problem_id)
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem
