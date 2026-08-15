"""Embedding service using Google Gemini for semantic search."""

import math
import os

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL = "models/gemini-embedding-001"


def _configure():
    """Ensure Gemini is configured."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is not configured.")
    genai.configure(api_key=GEMINI_API_KEY)


def get_embedding(text: str) -> list[float]:
    """Generate an embedding vector for the given text.

    Args:
        text: The text to embed.

    Returns:
        A list of floats representing the embedding vector.
    """
    _configure()
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def get_query_embedding(text: str) -> list[float]:
    """Generate an embedding vector optimized for search queries.

    Args:
        text: The search query text.

    Returns:
        A list of floats representing the query embedding vector.
    """
    _configure()
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """Compute cosine similarity between two vectors.

    Returns a value between -1 and 1, where 1 means identical direction.
    """
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    magnitude_a = math.sqrt(sum(a * a for a in vec_a))
    magnitude_b = math.sqrt(sum(b * b for b in vec_b))

    if magnitude_a == 0 or magnitude_b == 0:
        return 0.0

    return dot_product / (magnitude_a * magnitude_b)


def build_knowledge_text(technology: str, title: str, description: str,
                         solution: str, error_pattern: str = None,
                         tags: list[str] = None) -> str:
    """Build a combined text representation of a knowledge entry for embedding.

    Combines all relevant fields into a single string optimized for semantic matching.
    """
    parts = [
        f"Technology: {technology}",
        f"Problem: {title}",
        f"Description: {description}",
        f"Solution: {solution}",
    ]
    if error_pattern:
        parts.append(f"Error: {error_pattern}")
    if tags:
        parts.append(f"Tags: {', '.join(tags)}")

    return "\n".join(parts)
