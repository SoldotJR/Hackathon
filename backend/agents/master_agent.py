"""Master Recruitment Agent — orchestrates the full multi-agent pipeline."""

from __future__ import annotations

import time
import uuid
from datetime import datetime, timezone
from typing import Any, Awaitable, Callable

from agents.interview_agent import InterviewQuestionAgent
from agents.matching_agent import CandidateMatchingAgent
from agents.ranking_agent import CandidateRankingAgent
from agents.recommendation_agent import HiringRecommendationAgent
from agents.requirement_agent import RequirementAnalysisAgent
from agents.resume_parser_agent import ResumeParsingAgent
from agents.salary_agent import SalaryCompatibilityAgent
from agents.schedule_agent import InterviewSchedulingAgent
from agents.skill_gap_agent import SkillGapAgent
from schemas.recruitment import (
    RecruitmentPlan,
    RecruitmentSummary,
    WorkflowAgent,
)


ProgressCallback = Callable[[list[WorkflowAgent], str | None], Awaitable[None] | None]

AGENT_DEFS: list[tuple[str, str, str]] = [
    ("master", "Master Agent", "Orchestrates the autonomous recruitment pipeline"),
    ("requirement", "Requirement Analysis", "Parses hiring request into structured requirements"),
    ("resume-parser", "Resume Parsing", "Extracts skills and profile data from resumes"),
    ("matching", "Candidate Matching", "Scores candidates against role requirements"),
    ("skill-gap", "Skill Gap Analysis", "Identifies missing skills across the shortlist"),
    ("ranking", "Candidate Ranking", "Ranks candidates and assigns recommendation levels"),
    ("interview-generator", "Interview Questions", "Generates personalized interview questions"),
    ("salary-analysis", "Salary Analysis", "Checks salary expectations vs budget"),
    ("schedule", "Interview Scheduling", "Suggests interview slots for top candidates"),
    ("hiring-report", "Hiring Recommendation", "Produces final hire recommendations"),
]


def initial_agents() -> list[WorkflowAgent]:
    return [
        WorkflowAgent(id=i, label=l, description=d)  # type: ignore[arg-type]
        for i, l, d in AGENT_DEFS
    ]


class MasterRecruitmentAgent:
    def __init__(self) -> None:
        self.requirement = RequirementAnalysisAgent()
        self.resume_parser = ResumeParsingAgent()
        self.matching = CandidateMatchingAgent()
        self.skill_gap = SkillGapAgent()
        self.ranking = CandidateRankingAgent()
        self.interview = InterviewQuestionAgent()
        self.salary = SalaryCompatibilityAgent()
        self.schedule = InterviewSchedulingAgent()
        self.recommendation = HiringRecommendationAgent()

    async def run(
        self,
        request: str,
        uploaded_resumes: list[dict[str, Any]] | None = None,
        on_progress: ProgressCallback | None = None,
    ) -> RecruitmentPlan:
        started = time.perf_counter()
        agents = initial_agents()
        context: dict[str, Any] = {
            "request": request,
            "uploaded_resumes": uploaded_resumes or [],
            "explainability": {},
        }

        async def mark(agent_id: str, status: str, progress: int) -> None:
            for i, a in enumerate(agents):
                if a.id == agent_id:
                    agents[i] = a.model_copy(
                        update={"status": status, "progress": progress}  # type: ignore[arg-type]
                    )
            if on_progress:
                result = on_progress(agents, agent_id if status == "running" else None)
                if hasattr(result, "__await__"):
                    await result  # type: ignore[misc]

        # Master kickoff
        await mark("master", "running", 10)
        await mark("master", "completed", 100)

        pipeline = [
            ("requirement", self.requirement),
            ("resume-parser", self.resume_parser),
            ("matching", self.matching),
            ("skill-gap", self.skill_gap),
            ("ranking", self.ranking),
            ("interview-generator", self.interview),
            ("salary-analysis", self.salary),
            ("schedule", self.schedule),
            ("hiring-report", self.recommendation),
        ]

        for agent_id, agent in pipeline:
            await mark(agent_id, "running", 15)
            updates = await agent.run(context)
            context.update(updates)
            await mark(agent_id, "completed", 100)

        candidates = context.get("candidates") or []
        requirements = context["requirements"]
        top_matches = sum(1 for c in candidates if c.matchScore >= 85)
        avg = (
            round(sum(c.matchScore for c in candidates) / len(candidates), 1)
            if candidates
            else 0
        )

        elapsed_ms = int((time.perf_counter() - started) * 1000)
        plan = RecruitmentPlan(
            id=f"plan-{uuid.uuid4().hex[:10]}",
            request=request,
            createdAt=datetime.now(timezone.utc).isoformat(),
            summary=RecruitmentSummary(
                position=requirements.position,
                candidates=len(candidates),
                topMatches=top_matches,
                averageMatch=avg,
                budget=requirements.budget,
            ),
            candidates=candidates,
            skillGap=context["skill_gap"],
            interviewQuestions=context["interview_questions"],
            salaryAnalyses=context["salary_analyses"],
            schedule=context["schedule"],
            recommendations=context["recommendations"],
            agents=agents,
            requirements=requirements,
            processingTimeMs=elapsed_ms,
            confidenceScore=float(context.get("confidence_score") or 0),
            explainability=context.get("explainability") or {},
        )
        return plan
