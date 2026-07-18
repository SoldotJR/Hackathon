"""Lightweight skill embeddings via TF-IDF (Sentence-Transformers optional)."""

from __future__ import annotations

import logging
import re
from functools import lru_cache

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

logger = logging.getLogger(__name__)

_st_model = None


def _try_load_sentence_transformer():
    global _st_model
    if _st_model is not None:
        return _st_model
    try:
        from sentence_transformers import SentenceTransformer

        _st_model = SentenceTransformer("all-MiniLM-L6-v2")
        return _st_model
    except Exception as exc:  # noqa: BLE001
        logger.info("Sentence-Transformers unavailable, using TF-IDF: %s", exc)
        _st_model = False
        return None


def normalize_skill(s: str) -> str:
    return re.sub(r"\s+", " ", s.strip().lower())


@lru_cache(maxsize=1)
def _tfidf() -> TfidfVectorizer:
    return TfidfVectorizer(ngram_range=(1, 2), min_df=1)


def embed_texts(texts: list[str]) -> np.ndarray:
    model = _try_load_sentence_transformer()
    if model:
        return np.asarray(model.encode(texts, normalize_embeddings=True))
    vec = _tfidf()
    return vec.fit_transform(texts).toarray()


def similarity(a: str, b: str) -> float:
    if not a.strip() or not b.strip():
        return 0.0
    matrix = embed_texts([a, b])
    score = float(cosine_similarity([matrix[0]], [matrix[1]])[0][0])
    return max(0.0, min(1.0, score))


def skill_overlap_score(required: list[str], candidate_skills: list[str]) -> float:
    if not required:
        return 0.5
    req = {normalize_skill(s) for s in required}
    cand = {normalize_skill(s) for s in candidate_skills}
    if not cand:
        return 0.0
    exact = len(req & cand) / len(req)
    # soft matches via substring
    soft = 0
    for r in req:
        if any(r in c or c in r for c in cand):
            soft += 1
    soft_score = soft / len(req)
    return max(0.0, min(1.0, exact * 0.7 + soft_score * 0.3))
