"""Interview Question Agent — generates personalized interview questions."""

from __future__ import annotations

from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import InterviewQuestion
from services.llm import get_llm


class InterviewQuestionAgent(BaseAgent):
    id = "interview-generator"
    label = "Interview Questions"
    description = "Generates technical, behavioral, and culture-fit questions"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        requirements = context["requirements"]
        candidates = context.get("candidates") or []
        top = candidates[0] if candidates else None
        fallback = self._fallback(requirements, top)

        llm = get_llm()
        data = await llm.complete_json(
            system=(
                "You are an expert technical interviewer. Generate high-signal "
                "interview questions tailored to the role and top candidate."
            ),
            user=(
                f"Role: {requirements.position}\n"
                f"Skills: {', '.join(requirements.skills)}\n"
                f"Seniority: {requirements.seniority}\n"
                f"Top candidate: {top.name if top else 'N/A'} — "
                f"{top.resumeSummary if top else ''}\n\n"
                "Return JSON array of 8 objects with keys: id, category "
                "(Technical|Behavioral|Culture Fit|Communication), question, "
                "difficulty (Easy|Medium|Hard)."
            ),
            fallback=[q.model_dump() for q in fallback],
        )

        questions: list[InterviewQuestion] = []
        if isinstance(data, list):
            for i, item in enumerate(data):
                try:
                    if "id" not in item:
                        item["id"] = f"q{i+1}"
                    questions.append(InterviewQuestion.model_validate(item))
                except Exception:
                    continue
        if len(questions) < 4:
            questions = fallback

        return {
            "interview_questions": questions,
            "explainability": {
                **context.get("explainability", {}),
                "interview": {"provider": llm.provider, "count": len(questions)},
            },
        }

    def _fallback(self, requirements, top) -> list[InterviewQuestion]:
        skills = requirements.skills or ["React"]
        primary = skills[0]
        name = top.name if top else "the candidate"
        return [
            InterviewQuestion(
                id="q1",
                category="Technical",
                question=f"Walk us through how you would structure a scalable {primary} component for this role.",
                difficulty="Medium",
            ),
            InterviewQuestion(
                id="q2",
                category="Technical",
                question=f"How do you ensure type safety and maintainability when using {skills[1] if len(skills) > 1 else 'TypeScript'} in production?",
                difficulty="Medium",
            ),
            InterviewQuestion(
                id="q3",
                category="Technical",
                question="Describe a performance bottleneck you fixed in a frontend application. What metrics did you track?",
                difficulty="Hard",
            ),
            InterviewQuestion(
                id="q4",
                category="Behavioral",
                question=f"Tell us about a time {name.split()[0] if top else 'you'} had to learn a new framework quickly under deadline pressure.",
                difficulty="Medium",
            ),
            InterviewQuestion(
                id="q5",
                category="Behavioral",
                question="Describe a disagreement with a designer or PM and how you resolved it.",
                difficulty="Medium",
            ),
            InterviewQuestion(
                id="q6",
                category="Culture Fit",
                question="What kind of engineering culture helps you do your best work?",
                difficulty="Easy",
            ),
            InterviewQuestion(
                id="q7",
                category="Communication",
                question="Explain a complex technical trade-off to a non-technical stakeholder.",
                difficulty="Medium",
            ),
            InterviewQuestion(
                id="q8",
                category="Communication",
                question="How would you document a new design system contribution for other engineers?",
                difficulty="Easy",
            ),
        ]
