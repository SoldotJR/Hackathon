"""Salary Compatibility Agent."""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import SalaryAnalysis


class SalaryCompatibilityAgent(BaseAgent):
    id = "salary-analysis"
    label = "Salary Analysis"
    description = "Checks salary expectations against hiring budget"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        requirements = context["requirements"]
        candidates = context.get("candidates") or []
        budget = requirements.budget

        analyses: list[SalaryAnalysis] = []
        for cand in candidates[:8]:
            expectation = cand.salary
            diff = expectation - budget
            if expectation <= budget:
                compat = 100
            elif expectation <= budget * 1.1:
                compat = 85
            elif expectation <= budget * 1.25:
                compat = 60
            else:
                compat = max(15, int(100 - ((expectation - budget) / budget) * 80))

            analyses.append(
                SalaryAnalysis(
                    companyBudget=budget,
                    candidateExpectation=expectation,
                    difference=diff,
                    compatibility=compat,
                    candidateId=cand.id,
                    candidateName=cand.name,
                )
            )

        return {
            "salary_analyses": analyses,
            "explainability": {
                **context.get("explainability", {}),
                "salary": {"budget": budget, "analyzed": len(analyses)},
            },
        }
