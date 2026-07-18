"""Hiring Recommendation Agent — final hire/no-hire narrative."""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import HiringRecommendation
from services.llm import get_llm


class HiringRecommendationAgent(BaseAgent):
    id = "hiring-report"
    label = "Hiring Recommendation"
    description = "Produces explainable hire recommendations with confidence"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        requirements = context["requirements"]
        candidates = context.get("candidates") or []
        skill_gap = context.get("skill_gap")
        salary = context.get("salary_analyses") or []
        top = candidates[:5]

        fallback = self._fallback(top, requirements, skill_gap, salary)
        llm = get_llm()

        payload = [
            {
                "id": c.id,
                "name": c.name,
                "match": c.matchScore,
                "salary": c.salary,
                "level": c.recommendation,
                "summary": c.resumeSummary,
            }
            for c in top
        ]
        data = await llm.complete_json(
            system=(
                "You are a chief hiring officer AI. Produce concise, explainable "
                "hiring recommendations for each top candidate."
            ),
            user=(
                f"Role: {requirements.position}, headcount {requirements.headcount}, "
                f"budget ${requirements.budget}/mo, skills {requirements.skills}.\n"
                f"Candidates: {payload}\n"
                f"Skill gaps: {skill_gap.missing if skill_gap else []}\n\n"
                "Return JSON array with: candidateId, candidateName, level "
                "(Highly Recommended|Recommended|Needs Review), reasoning, "
                "pros (string[]), cons (string[]), riskLevel (Low|Medium|High)."
            ),
            fallback=[r.model_dump() for r in fallback],
        )

        recommendations: list[HiringRecommendation] = []
        if isinstance(data, list):
            for item in data:
                try:
                    recommendations.append(HiringRecommendation.model_validate(item))
                except Exception:
                    continue
        if not recommendations:
            recommendations = fallback

        # confidence = avg of top match scores / 100
        confidence = (
            round(sum(c.matchScore for c in top) / (len(top) * 100), 3) if top else 0.5
        )

        return {
            "recommendations": recommendations,
            "confidence_score": confidence,
            "explainability": {
                **context.get("explainability", {}),
                "recommendation": {
                    "provider": llm.provider,
                    "confidence": confidence,
                    "count": len(recommendations),
                },
            },
        }

    def _fallback(self, top, requirements, skill_gap, salary) -> list[HiringRecommendation]:
        salary_map = {s.candidateId: s for s in salary}
        missing = skill_gap.missing if skill_gap else []
        results: list[HiringRecommendation] = []
        for c in top:
            sa = salary_map.get(c.id)
            pros = [
                f"{c.matchScore}% overall match to {requirements.position}",
                f"{c.experienceLabel} relevant experience",
            ]
            if sa and sa.compatibility >= 80:
                pros.append("Within or near budget")
            cons: list[str] = []
            if sa and sa.difference > 0:
                cons.append(f"${sa.difference}/mo above budget")
            if missing:
                cons.append(f"Team skill gap remains on: {', '.join(missing[:3])}")
            if c.experience > requirements.experience_max + 2:
                cons.append("Possibly overqualified for seniority target")
            if not cons:
                cons.append("Limited long-term seniority signal from short tenure")

            risk = "Low" if c.matchScore >= 90 else "Medium" if c.matchScore >= 75 else "High"
            results.append(
                HiringRecommendation(
                    candidateId=c.id,
                    candidateName=c.name,
                    level=c.recommendation,
                    reasoning=(
                        f"{c.name} scores {c.matchScore}% against the "
                        f"{requirements.position} brief. "
                        f"{c.resumeSummary[:160]}"
                    ),
                    pros=pros,
                    cons=cons,
                    riskLevel=risk,  # type: ignore[arg-type]
                )
            )
        return results
