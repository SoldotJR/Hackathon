"""Interview Scheduling Agent — proposes interview timeline."""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

from agents.base import BaseAgent
from schemas.recruitment import InterviewSlot


class InterviewSchedulingAgent(BaseAgent):
    id = "schedule"
    label = "Interview Scheduling"
    description = "Suggests interview slots for top candidates"

    async def run(self, context: dict[str, Any]) -> dict[str, Any]:
        candidates = context.get("candidates") or []
        top = [
            c
            for c in candidates
            if c.recommendation in ("Highly Recommended", "Recommended")
        ][:5]
        if not top:
            top = candidates[:3]

        start = datetime.utcnow() + timedelta(days=2)
        # snap to next weekday
        while start.weekday() >= 5:
            start += timedelta(days=1)

        slots: list[InterviewSlot] = []
        times = [("10:00 AM", "Technical Screen"), ("2:00 PM", "Culture Fit"), ("4:00 PM", "Final Round")]
        day = start
        idx = 0
        for cand in top:
            # skip weekends
            while day.weekday() >= 5:
                day += timedelta(days=1)
            time_str, itype = times[idx % len(times)]
            slots.append(
                InterviewSlot(
                    id=f"slot-{cand.id}",
                    day=day.strftime("%A"),
                    date=day.strftime("%b %d, %Y"),
                    time=time_str,
                    candidateId=cand.id,
                    candidateName=cand.name,
                    type=itype,
                    duration="45 min",
                )
            )
            idx += 1
            day += timedelta(days=1)

        return {
            "schedule": slots,
            "explainability": {
                **context.get("explainability", {}),
                "schedule": {"slots": len(slots), "startDate": start.isoformat()},
            },
        }
