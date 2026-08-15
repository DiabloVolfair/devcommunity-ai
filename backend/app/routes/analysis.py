"""AI analysis routes."""

from fastapi import APIRouter, HTTPException

from app.models.analysis import AnalysisResponse
from app.services.ai_service import analyze_problem
from app.storage.memory_store import store

router = APIRouter(prefix="/problems", tags=["analysis"])


@router.post("/{problem_id}/analyze", response_model=AnalysisResponse)
def analyze(problem_id: str):
    """Analyze a submitted problem using AI troubleshooting."""
    problem = store.get_problem(problem_id)
    if problem is None:
        raise HTTPException(status_code=404, detail="Problem not found")

    try:
        result = analyze_problem(problem)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return result
