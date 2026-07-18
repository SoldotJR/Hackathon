"""Resume Parsing Agent — extracts structured candidate data from resumes."""

from __future__ import annotations

import copy
import re
import uuid
from typing import Any

from agents.base import BaseAgent
from services.llm import get_llm
from services.seed_data import SEED_CANDIDATES


class ResumeParsingAgent(BaseAgent):
    id = "resume-parser"
    label = "Resume Parsing"
    description = "Extracts skills, experience, and profile data from resumes"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        uploaded = context.get("uploaded_resumes") or []
        llm = get_llm()
        parsed: list[dict[str, Any]] = []

        if uploaded:
            for resume in uploaded:
                candidate = await self._parse_resume(resume, llm)
                parsed.append(candidate)
        else:
            # Use talent pool as parsed candidates for demo / no-upload path
            parsed = [copy.deepcopy(c) for c in SEED_CANDIDATES]

        return {
            "raw_candidates": parsed,
            "explainability": {
                **context.get("explainability", {}),
                "resume_parser": {
                    "provider": llm.provider,
                    "source": "uploads" if uploaded else "talent_pool",
                    "count": len(parsed),
                },
            },
        }

    async def _parse_resume(self, resume: dict[str, Any], llm) -> dict[str, Any]:
        text = resume.get("text", "")
        filename = resume.get("filename", "resume.pdf")
        fallback = self._heuristic_parse(text, filename)

        data = await llm.complete_json(
            system=(
                "You are an expert resume parser for technical recruiting. "
                "Extract structured candidate profiles from resume text."
            ),
            user=(
                f"Resume text:\n{text[:8000]}\n\n"
                "Return JSON: name, title, experience (years number), "
                "skills (array of {name, level 0-100}), education (array of "
                "{degree, institution, year}), certificates (array), projects "
                "(array of {name, description, tech[]}), salary (monthly USD int), "
                "portfolio, linkedin, github, resumeSummary, location."
            ),
            fallback=fallback,
        )

        cid = resume.get("id") or f"u-{uuid.uuid4().hex[:8]}"
        name = data.get("name") or fallback["name"]
        seed = name.replace(" ", "")
        return {
            "id": cid,
            "name": name,
            "photo": f"https://api.dicebear.com/9.x/avataaars/svg?seed={seed}",
            "title": data.get("title") or fallback["title"],
            "experience": float(data.get("experience") or fallback["experience"]),
            "experienceLabel": f"{data.get('experience') or fallback['experience']} years",
            "skills": data.get("skills") or fallback["skills"],
            "education": data.get("education") or fallback["education"],
            "certificates": data.get("certificates") or [],
            "projects": data.get("projects") or [],
            "salary": int(data.get("salary") or fallback["salary"]),
            "portfolio": data.get("portfolio") or "",
            "linkedin": data.get("linkedin") or "",
            "github": data.get("github") or "",
            "resumeSummary": data.get("resumeSummary") or fallback["resumeSummary"],
            "location": data.get("location") or "Remote",
            "english": True,
        }

    def _heuristic_parse(self, text: str, filename: str) -> dict[str, Any]:
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        name = lines[0][:60] if lines else filename.replace(".pdf", "").replace("_", " ")
        skill_vocab = [
            "React",
            "TypeScript",
            "JavaScript",
            "Tailwind CSS",
            "Next.js",
            "Node.js",
            "Python",
            "Docker",
            "AWS",
            "GraphQL",
            "PostgreSQL",
            "Figma",
            "CSS",
            "HTML",
            "Git",
        ]
        found = []
        lower = text.lower()
        for skill in skill_vocab:
            if skill.lower() in lower:
                found.append({"name": skill, "level": 75})
        if not found:
            found = [
                {"name": "JavaScript", "level": 70},
                {"name": "React", "level": 65},
            ]

        years = 1.0
        ym = re.search(r"(\d+(?:\.\d+)?)\+?\s*years?", lower)
        if ym:
            years = float(ym.group(1))

        return {
            "name": name.title(),
            "title": "Software Developer",
            "experience": years,
            "skills": found,
            "education": [],
            "certificates": [],
            "projects": [],
            "salary": 1300,
            "resumeSummary": (text[:280] + "…") if len(text) > 280 else text or "Parsed from uploaded resume.",
        }
