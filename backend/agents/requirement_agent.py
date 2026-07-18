"""Requirement Analysis Agent — parses hiring request into structured requirements."""

from __future__ import annotations

import re
from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import HiringRequirements
from services.llm import get_llm


class RequirementAnalysisAgent(BaseAgent):
    id = "requirement"
    label = "Requirement Analysis"
    description = "Parses hiring request into structured role requirements"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        request: str = context["request"]
        fallback = self._heuristic(request)

        llm = get_llm()
        data = await llm.complete_json(
            system=(
                "You are an expert HR requirements analyst. "
                "Extract structured hiring requirements from the recruiter request."
            ),
            user=(
                f"Hiring request:\n{request}\n\n"
                "Return JSON with keys: position (str), headcount (int), "
                "skills (string[]), budget (int monthly USD), experience_min (number), "
                "experience_max (number), english_required (bool), seniority (str), "
                "location (str|null), notes (str)."
            ),
            fallback=fallback.model_dump(),
        )

        try:
            requirements = HiringRequirements.model_validate(data)
        except Exception:
            requirements = fallback

        if not requirements.skills:
            requirements.skills = fallback.skills
        if requirements.budget <= 0:
            requirements.budget = fallback.budget

        return {
            "requirements": requirements,
            "explainability": {
                **context.get("explainability", {}),
                "requirement": {
                    "provider": llm.provider,
                    "extractedSkills": requirements.skills,
                    "budget": requirements.budget,
                    "headcount": requirements.headcount,
                },
            },
        }

    def _heuristic(self, request: str) -> HiringRequirements:
        text = request.lower()
        skills: list[str] = []
        skill_vocab = [
            "React",
            "TypeScript",
            "JavaScript",
            "TailwindCSS",
            "Tailwind CSS",
            "Next.js",
            "Node.js",
            "Python",
            "FastAPI",
            "PostgreSQL",
            "Docker",
            "AWS",
            "GraphQL",
            "Vue",
            "Angular",
            "Figma",
        ]
        for skill in skill_vocab:
            if skill.lower().replace(" ", "") in text.replace(" ", "").replace("-", ""):
                skills.append(skill if skill != "TailwindCSS" else "Tailwind CSS")

        # dedupe preserving order
        seen: set[str] = set()
        unique_skills: list[str] = []
        for s in skills:
            key = s.lower()
            if key not in seen:
                seen.add(key)
                unique_skills.append(s)
        if not unique_skills:
            unique_skills = ["React", "TypeScript", "Tailwind CSS"]

        budget = 1500
        m = re.search(r"\$?\s*(\d{3,5})\s*(?:/|per)?\s*month", text)
        if m:
            budget = int(m.group(1))
        else:
            m2 = re.search(r"under\s+\$?\s*(\d{3,5})", text)
            if m2:
                budget = int(m2.group(1))

        headcount = 1
        hm = re.search(r"\b(two|three|four|five|\d+)\b", text)
        if hm:
            word = hm.group(1)
            mapping = {"two": 2, "three": 3, "four": 4, "five": 5}
            headcount = mapping.get(word, int(word) if word.isdigit() else 1)

        seniority = "Junior"
        if "senior" in text:
            seniority = "Senior"
        elif "mid" in text or "intermediate" in text:
            seniority = "Mid"

        position = "Frontend Developer"
        if "backend" in text:
            position = "Backend Developer"
        elif "full" in text and "stack" in text:
            position = "Full-Stack Developer"
        elif "frontend" in text or "front-end" in text or "front end" in text:
            position = f"{seniority} Frontend Developer"
        else:
            position = f"{seniority} Software Engineer"

        return HiringRequirements(
            position=position,
            headcount=max(1, headcount),
            skills=unique_skills,
            budget=budget,
            experience_min=0 if seniority == "Junior" else 2,
            experience_max=3 if seniority == "Junior" else 8,
            english_required="english" in text,
            seniority=seniority,
            notes=request[:500],
        )
