"""Knowledge base storage with JSON persistence, keyword search, and semantic search."""

import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from app.models.knowledge import (
    KnowledgeCreate,
    KnowledgeEntry,
    create_knowledge_id,
)

logger = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent.parent / "data"
KNOWLEDGE_FILE = DATA_DIR / "knowledge.json"
EMBEDDINGS_FILE = DATA_DIR / "embeddings.json"


class KnowledgeStore:
    """Knowledge base with in-memory access, JSON persistence, and semantic search."""

    def __init__(self):
        self._entries: dict[str, KnowledgeEntry] = {}
        self._embeddings: dict[str, list[float]] = {}
        self._load()
        self._load_embeddings()

    def _load(self):
        """Load knowledge entries from JSON file if it exists."""
        if KNOWLEDGE_FILE.exists():
            try:
                raw = json.loads(KNOWLEDGE_FILE.read_text(encoding="utf-8"))
                for item in raw:
                    entry = KnowledgeEntry(**item)
                    self._entries[entry.id] = entry
            except (json.JSONDecodeError, Exception):
                pass

    def _load_embeddings(self):
        """Load pre-computed embeddings from file."""
        if EMBEDDINGS_FILE.exists():
            try:
                self._embeddings = json.loads(
                    EMBEDDINGS_FILE.read_text(encoding="utf-8")
                )
            except (json.JSONDecodeError, Exception):
                self._embeddings = {}

    def _save(self):
        """Persist all entries to JSON file."""
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        data = [entry.model_dump(mode="json") for entry in self._entries.values()]
        KNOWLEDGE_FILE.write_text(
            json.dumps(data, indent=2, default=str), encoding="utf-8"
        )

    def _save_embeddings(self):
        """Persist embeddings to file."""
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        EMBEDDINGS_FILE.write_text(
            json.dumps(self._embeddings), encoding="utf-8"
        )

    def _generate_embedding(self, entry: KnowledgeEntry) -> Optional[list[float]]:
        """Generate and store embedding for a knowledge entry."""
        try:
            from app.services.embedding_service import build_knowledge_text, get_embedding

            text = build_knowledge_text(
                technology=entry.technology,
                title=entry.problem_title,
                description=entry.problem_description,
                solution=entry.solution,
                error_pattern=entry.error_pattern,
                tags=entry.tags,
            )
            embedding = get_embedding(text)
            self._embeddings[entry.id] = embedding
            self._save_embeddings()
            return embedding
        except Exception as e:
            logger.warning(f"Failed to generate embedding for {entry.id}: {e}")
            return None

    def create(self, knowledge: KnowledgeCreate) -> KnowledgeEntry:
        """Store a new knowledge entry and generate its embedding."""
        now = datetime.now(timezone.utc)
        entry = KnowledgeEntry(
            id=create_knowledge_id(),
            technology=knowledge.technology,
            problem_title=knowledge.problem_title,
            problem_description=knowledge.problem_description,
            solution=knowledge.solution,
            error_pattern=knowledge.error_pattern,
            tags=knowledge.tags,
            source_problem_id=knowledge.source_problem_id,
            validations_positive=0,
            validations_negative=0,
            trust_score=0.0,
            created_at=now,
            updated_at=now,
        )
        self._entries[entry.id] = entry
        self._save()

        # Generate embedding in background (non-blocking for the response)
        self._generate_embedding(entry)

        return entry

    def get(self, entry_id: str) -> Optional[KnowledgeEntry]:
        """Get a knowledge entry by ID."""
        return self._entries.get(entry_id)

    def list_all(self) -> list[KnowledgeEntry]:
        """Return all entries, newest first."""
        return sorted(
            self._entries.values(),
            key=lambda e: e.created_at,
            reverse=True,
        )

    def count(self) -> int:
        """Total number of knowledge entries."""
        return len(self._entries)

    def search(self, query: str, technology: Optional[str] = None) -> list[KnowledgeEntry]:
        """Search knowledge base by keyword matching (fallback).

        Searches across: problem_title, problem_description, solution,
        error_pattern, tags, and technology.
        """
        if not query.strip():
            return self.list_all()

        keywords = query.lower().split()
        scored: list[tuple[int, KnowledgeEntry]] = []

        for entry in self._entries.values():
            if technology and entry.technology.lower() != technology.lower():
                continue

            searchable = " ".join([
                entry.technology.lower(),
                entry.problem_title.lower(),
                entry.problem_description.lower(),
                entry.solution.lower(),
                (entry.error_pattern or "").lower(),
                " ".join(tag.lower() for tag in entry.tags),
            ])

            score = sum(1 for kw in keywords if kw in searchable)

            if score > 0:
                scored.append((score, entry))

        scored.sort(key=lambda x: (-x[0], x[1].created_at))
        return [entry for _, entry in scored]

    def semantic_search(self, query: str, top_k: int = 5, technology: Optional[str] = None) -> list[tuple[float, KnowledgeEntry]]:
        """Search knowledge base using semantic similarity.

        Args:
            query: Natural language search query.
            top_k: Number of top results to return.
            technology: Optional technology filter.

        Returns:
            List of (similarity_score, entry) tuples sorted by relevance.
        """
        try:
            from app.services.embedding_service import cosine_similarity, get_query_embedding

            query_embedding = get_query_embedding(query)
        except Exception as e:
            logger.warning(f"Semantic search failed, falling back to keyword: {e}")
            # Fallback to keyword search
            results = self.search(query, technology)
            return [(1.0, entry) for entry in results[:top_k]]

        scored: list[tuple[float, KnowledgeEntry]] = []

        for entry_id, entry in self._entries.items():
            if technology and entry.technology.lower() != technology.lower():
                continue

            # Get stored embedding or generate on the fly
            embedding = self._embeddings.get(entry_id)
            if embedding is None:
                embedding = self._generate_embedding(entry)
            if embedding is None:
                continue

            similarity = cosine_similarity(query_embedding, embedding)
            scored.append((similarity, entry))

        # Sort by similarity descending
        scored.sort(key=lambda x: -x[0])
        return scored[:top_k]

    def search_for_problem(self, technology: str, description: str, error: Optional[str] = None) -> list[KnowledgeEntry]:
        """Find relevant knowledge for a given problem using semantic search.

        Used internally by the AI service to retrieve context (RAG).
        Falls back to keyword search if embeddings are unavailable.
        """
        # Build a natural language query from the problem
        query_parts = [f"{technology} problem:", description]
        if error:
            query_parts.append(f"Error: {error}")
        query = " ".join(query_parts)

        results = self.semantic_search(query, top_k=5, technology=None)

        # Filter out low-relevance results (below 0.3 similarity)
        relevant = [entry for score, entry in results if score > 0.3]

        return relevant if relevant else [entry for _, entry in results[:3]]

    def ensure_embeddings(self):
        """Generate embeddings for any entries that don't have them yet."""
        missing = [
            entry for entry_id, entry in self._entries.items()
            if entry_id not in self._embeddings
        ]
        if not missing:
            return 0

        count = 0
        for entry in missing:
            if self._generate_embedding(entry):
                count += 1

        return count


# Singleton instance
knowledge_store = KnowledgeStore()
