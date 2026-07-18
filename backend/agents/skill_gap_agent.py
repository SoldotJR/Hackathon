"""Skill Gap Agent — finds missing skills vs requirements."""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import SkillGapData
from services.embeddings import normalize_skill


class SkillGapAgent(BaseAgent):
    id = "skill-gap"
    label = "Skill Gap Analysis"
    description = "Identifies missing skills and coverage gaps"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        requirements = context["requirements"]
        candidates = context.get("matched_candidates") or []
        top = candidates[:5] if candidates else []

        labels = requirements.skills or ["React", "TypeScript", "Tailwind CSS"]
        required = [90] * len(labels)
        current: list[int] = []
        missing: list[str] = []

        for skill in labels:
            levels: list[int] = []
            for cand in top:
                for s in cand.get("skills", []):
                    name = s["name"] if isinstance(s, dict) else s.name
                    level = s["level"] if isinstance(s, dict) else s.level
                    if normalize_skill(name) == normalize_skill(skill) or normalize_skill(
                        skill
                    ) in normalize_skill(name):
                        levels.append(int(level))
            avg = int(round(sum(levels) / len(levels))) if levels else 35
            current.append(avg)
            if avg < 70:
                missing.append(skill)

        # Also flag skills never present in top candidates
        for skill in labels:
            present = False
            for cand in top:
                names = [
                    normalize_skill(s["name"] if isinstance(s, dict) else s.name)
                    for s in cand.get("skills", [])
                ]
                if any(
                    normalize_skill(skill) in n or n in normalize_skill(skill)
                    for n in names
                ):
                    present = True
                    break
            if not present and skill not in missing:
                missing.append(skill)

        skill_gap = SkillGapData(
            labels=labels,
            required=required,
            current=current,
            missing=missing,
        )

        return {
            "skill_gap": skill_gap,
            "explainability": {
                **context.get("explainability", {}),
                "skill_gap": {"missing": missing, "labels": labels},
            },
        }
