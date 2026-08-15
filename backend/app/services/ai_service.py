"""AI troubleshooting service using Google Gemini."""

import json
import os
from datetime import datetime, timezone

import google.generativeai as genai
from dotenv import load_dotenv

from app.models.analysis import AnalysisResponse
from app.models.knowledge import KnowledgeEntry
from app.models.problem import ProblemResponse

load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

SYSTEM_PROMPT = """You are DevCommunity AI, a technical troubleshooting assistant for developers.

When given a technical problem, analyze it and respond with a JSON object containing:
- "understanding": A clear summary of what the problem is (1-3 sentences).
- "likely_causes": A list of 2-5 likely causes for the problem.
- "recommended_solution": The most likely solution (1-3 sentences).
- "troubleshooting_steps": A list of 3-7 actionable troubleshooting steps.
- "additional_notes": Any extra warnings or context (or null if none).
- "confidence": Your confidence level — "low", "medium", or "high".

Rules:
- Always respond with valid JSON only, no markdown or extra text.
- Be specific and actionable in your troubleshooting steps.
- Base your confidence on how clearly the problem can be diagnosed from the given information.
- If the problem description is vague, set confidence to "low" and ask for more info in additional_notes.
- If community knowledge is provided, use it to improve your answer and increase confidence.
- Reference community solutions when they are relevant.
"""


def _build_user_prompt(problem: ProblemResponse, knowledge: list[KnowledgeEntry] = None) -> str:
    """Build the user prompt from a problem submission, including community knowledge."""
    parts = [
        f"Technology: {problem.technology}",
        f"Title: {problem.title}",
        f"Description: {problem.description}",
    ]

    if problem.error_message:
        parts.append(f"Error Message:\n{problem.error_message}")

    if problem.logs:
        parts.append(f"Logs:\n{problem.logs}")

    if problem.context:
        parts.append(f"Additional Context:\n{problem.context}")

    # Append community knowledge if available
    if knowledge:
        parts.append("\n--- Community Knowledge (previously solved problems) ---")
        for i, entry in enumerate(knowledge, 1):
            kb_text = (
                f"\n[Solution {i}] (Trust Score: {entry.trust_score}%)\n"
                f"Problem: {entry.problem_title}\n"
                f"Solution: {entry.solution}"
            )
            if entry.error_pattern:
                kb_text += f"\nError Pattern: {entry.error_pattern}"
            parts.append(kb_text)

    return "\n\n".join(parts)


def _parse_ai_response(raw_text: str, problem_id: str) -> AnalysisResponse:
    """Parse the AI response text into a structured AnalysisResponse."""
    # Strip markdown code fences if present
    text = raw_text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    data = json.loads(text)

    return AnalysisResponse(
        problem_id=problem_id,
        understanding=data["understanding"],
        likely_causes=data["likely_causes"],
        recommended_solution=data["recommended_solution"],
        troubleshooting_steps=data["troubleshooting_steps"],
        additional_notes=data.get("additional_notes"),
        confidence=data["confidence"],
        analyzed_at=datetime.now(timezone.utc),
    )


def analyze_problem(problem: ProblemResponse) -> AnalysisResponse:
    """Analyze a technical problem using Google Gemini.

    Retrieves relevant community knowledge first to ground the AI response.

    Args:
        problem: The problem to analyze.

    Returns:
        Structured analysis response.

    Raises:
        ValueError: If the API key is not configured.
        RuntimeError: If the AI response cannot be parsed.
    """
    if not GEMINI_API_KEY:
        raise ValueError(
            "GEMINI_API_KEY is not configured. "
            "Set it in your .env file or environment variables."
        )

    # Retrieve relevant community knowledge
    from app.storage.knowledge_store import knowledge_store

    relevant_knowledge = knowledge_store.search_for_problem(
        technology=problem.technology,
        description=problem.description,
        error=problem.error_message,
    )

    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        system_instruction=SYSTEM_PROMPT,
    )

    user_prompt = _build_user_prompt(problem, knowledge=relevant_knowledge)

    response = model.generate_content(user_prompt)

    try:
        return _parse_ai_response(response.text, problem.id)
    except (json.JSONDecodeError, KeyError) as e:
        raise RuntimeError(
            f"Failed to parse AI response: {e}\nRaw response: {response.text}"
        )
