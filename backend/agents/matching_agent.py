"""Candidate Matching Agent — scores candidates against requirements."""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from services.embeddings import similarity, skill_overlap_score


class CandidateMatchingAgent(BaseAgent):
    id = "matching"
    label = "Candidate Matching"
    description = "Compares candidates to role requirements using embeddings"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        requirements = context["requirements"]
        raw = context.get("raw_candidates") or []

        req_blob = (
            f"{requirements.position}. Skills: {', '.join(requirements.skills)}. "
            f"Seniority: {requirements.seniority}. Budget: {requirements.budget}."
        )

        matched: list[dict[str, Any]] = []
        for cand in raw:
            skill_names = [s["name"] if isinstance(s, dict) else s.name for s in cand.get("skills", [])]
            skill_score = skill_overlap_score(requirements.skills, skill_names)

            cand_blob = (
                f"{cand.get('title', '')}. {cand.get('resumeSummary', '')}. "
                f"Skills: {', '.join(skill_names)}"
            )
            semantic = similarity(req_blob, cand_blob)

            exp = float(cand.get("experience", 0))
            exp_fit = 1.0
            if exp < requirements.experience_min:
                exp_fit = max(0.4, exp / max(requirements.experience_min, 0.5))
            elif exp > requirements.experience_max + 2:
                exp_fit = 0.7  # overqualified penalty

            budget = requirements.budget
            salary = int(cand.get("salary", budget))
            if salary <= budget:
                salary_fit = 1.0
            elif salary <= budget * 1.15:
                salary_fit = 0.75
            else:
                salary_fit = max(0.2, 1 - (salary - budget) / max(budget, 1))

            english_ok = 1.0 if (not requirements.english_required or cand.get("english", True)) else 0.5

            match = (
                skill_score * 0.45
                + semantic * 0.25
                + exp_fit * 0.15
                + salary_fit * 0.10
                + english_ok * 0.05
            )
            match_pct = int(round(match * 100))

            matched.append(
                {
                    **cand,
                    "matchScore": match_pct,
                    "_scores": {
                        "skill": round(skill_score, 3),
                        "semantic": round(semantic, 3),
                        "experience": round(exp_fit, 3),
                        "salary": round(salary_fit, 3),
                        "english": english_ok,
                    },
                }
            )

        matched.sort(key=lambda c: c["matchScore"], reverse=True)
        return {
            "matched_candidates": matched,
            "explainability": {
                **context.get("explainability", {}),
                "matching": {
                    "method": "tfidf+skill-overlap",
                    "weights": {
                        "skill": 0.45,
                        "semantic": 0.25,
                        "experience": 0.15,
                        "salary": 0.10,
                        "english": 0.05,
                    },
                    "topScore": matched[0]["matchScore"] if matched else 0,
                },
            },
        }
