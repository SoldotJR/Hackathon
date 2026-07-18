"""Candidate Ranking Agent — final ranking + recommendation badges."""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import Candidate, RecommendationLevel


class CandidateRankingAgent(BaseAgent):
    id = "ranking"
    label = "Candidate Ranking"
    description = "Ranks candidates and assigns recommendation levels"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        matched = context.get("matched_candidates") or []
        requirements = context["requirements"]
        ranked: list[Candidate] = []

        for cand in matched:
            score = int(cand.get("matchScore", 0))
            salary = int(cand.get("salary", 0))
            budget = requirements.budget

            level: RecommendationLevel
            if score >= 90 and salary <= budget * 1.1:
                level = "Highly Recommended"
            elif score >= 75:
                level = "Recommended"
            else:
                level = "Needs Review"

            if (
                requirements.seniority.lower() == "junior"
                and float(cand.get("experience", 0)) >= 5
                and score >= 90
            ):
                level = "Recommended"

            ranked.append(
                Candidate(
                    id=str(cand["id"]),
                    name=cand["name"],
                    photo=cand.get("photo")
                    or f"https://api.dicebear.com/9.x/avataaars/svg?seed={cand['name']}",
                    title=cand.get("title", "Candidate"),
                    experience=float(cand.get("experience", 0)),
                    experienceLabel=cand.get("experienceLabel")
                    or f"{cand.get('experience', 0)} years",
                    skills=cand.get("skills", []),
                    education=cand.get("education", []),
                    certificates=cand.get("certificates", []),
                    projects=cand.get("projects", []),
                    salary=salary,
                    matchScore=score,
                    portfolio=cand.get("portfolio", ""),
                    linkedin=cand.get("linkedin", ""),
                    github=cand.get("github", ""),
                    recommendation=level,
                    resumeSummary=cand.get("resumeSummary", ""),
                    location=cand.get("location", ""),
                )
            )

        ranked.sort(key=lambda c: c.matchScore, reverse=True)
        return {
            "candidates": ranked,
            "explainability": {
                **context.get("explainability", {}),
                "ranking": {
                    "count": len(ranked),
                    "highlyRecommended": sum(
                        1 for c in ranked if c.recommendation == "Highly Recommended"
                    ),
                },
            },
        }
