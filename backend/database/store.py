"""In-memory store for plans, resumes, and workflow state (Supabase-ready)."""

from __future__ import annotations

from typing import Any

from schemas.recruitment import (
    AnalyticsData,
    Candidate,
    DashboardStats,
    RecruitmentPlan,
    WorkflowAgent,
)
from agents.master_agent import initial_agents


class AppStore:
    def __init__(self) -> None:
        self.plans: dict[str, RecruitmentPlan] = {}
        self.latest_plan_id: str | None = None
        self.resumes: dict[str, dict[str, Any]] = {}
        self.workflow: list[WorkflowAgent] = initial_agents()

    def save_plan(self, plan: RecruitmentPlan) -> None:
        self.plans[plan.id] = plan
        self.latest_plan_id = plan.id
        self.workflow = plan.agents

    def get_plan(self, plan_id: str | None = None) -> RecruitmentPlan | None:
        if plan_id and plan_id in self.plans:
            return self.plans[plan_id]
        if self.latest_plan_id:
            return self.plans.get(self.latest_plan_id)
        return None

    def all_candidates(self) -> list[Candidate]:
        plan = self.get_plan()
        return plan.candidates if plan else []

    def dashboard_stats(self) -> DashboardStats:
        plan = self.get_plan()
        if not plan:
            return DashboardStats(
                activeRequests=0,
                totalCandidates=0,
                interviewsScheduled=0,
                avgMatchScore=0,
                hireRate=0,
                timeToHire=0,
            )
        return DashboardStats(
            activeRequests=len(self.plans),
            totalCandidates=len(plan.candidates),
            interviewsScheduled=len(plan.schedule),
            avgMatchScore=plan.summary.averageMatch,
            hireRate=round(
                100
                * sum(1 for r in plan.recommendations if r.level == "Highly Recommended")
                / max(len(plan.recommendations), 1),
                1,
            ),
            timeToHire=round(plan.processingTimeMs / 1000 / 60 / 60 / 24 + 7, 1),
        )

    def analytics(self) -> AnalyticsData:
        plan = self.get_plan()
        if not plan:
            return AnalyticsData(
                candidateDistribution=[],
                skillMatch=[],
                experienceDistribution=[],
                salaryDistribution=[],
                recruitmentTimeline=[],
            )

        dist = {"Highly Recommended": 0, "Recommended": 0, "Needs Review": 0}
        for c in plan.candidates:
            dist[c.recommendation] = dist.get(c.recommendation, 0) + 1

        skill_map: dict[str, list[int]] = {}
        for c in plan.candidates:
            for s in c.skills:
                skill_map.setdefault(s.name, []).append(s.level)
        skill_match = [
            {"skill": k, "score": int(sum(v) / len(v))}
            for k, v in list(skill_map.items())[:8]
        ]

        buckets = {"0-1": 0, "1-3": 0, "3-5": 0, "5+": 0}
        for c in plan.candidates:
            if c.experience < 1:
                buckets["0-1"] += 1
            elif c.experience < 3:
                buckets["1-3"] += 1
            elif c.experience < 5:
                buckets["3-5"] += 1
            else:
                buckets["5+"] += 1

        salary_buckets = {"<$1200": 0, "$1200-1500": 0, "$1500-2000": 0, "$2000+": 0}
        for c in plan.candidates:
            if c.salary < 1200:
                salary_buckets["<$1200"] += 1
            elif c.salary <= 1500:
                salary_buckets["$1200-1500"] += 1
            elif c.salary <= 2000:
                salary_buckets["$1500-2000"] += 1
            else:
                salary_buckets["$2000+"] += 1

        return AnalyticsData(
            candidateDistribution=[
                {"name": k, "value": v} for k, v in dist.items() if v
            ],
            skillMatch=skill_match,
            experienceDistribution=[
                {"range": k, "count": v} for k, v in buckets.items()
            ],
            salaryDistribution=[
                {"range": k, "count": v} for k, v in salary_buckets.items()
            ],
            recruitmentTimeline=[
                {"stage": "Sourcing", "days": 1},
                {"stage": "AI Screening", "days": 0.1},
                {"stage": "Interviews", "days": 5},
                {"stage": "Offer", "days": 2},
            ],
        )


store = AppStore()
