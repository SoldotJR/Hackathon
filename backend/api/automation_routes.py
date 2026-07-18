"""Additive automation API — does not modify recruitment routes."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from schemas.recruitment import ApiResponse

router = APIRouter(prefix="/api/automation", tags=["automation"])


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# In-memory store for demo / API-ready surface
_emails: list[dict[str, Any]] = []
_offers: list[dict[str, Any]] = []
_evals: list[dict[str, Any]] = []


class GenerateEmailPayload(BaseModel):
    event: Literal[
        "Resume Received",
        "Interview Invitation",
        "Interview Completed",
        "Offer Congratulation",
        "Rejection",
    ]
    candidateName: str = "Candidate"


class EvalPayload(BaseModel):
    candidateName: str
    notes: str = ""


class OfferPayload(BaseModel):
    candidateName: str
    role: str = "Software Engineer"


@router.get("/emails")
async def list_emails() -> ApiResponse:
    from services.automation_data import EMAILS

    data = _emails or EMAILS
    return ApiResponse(success=True, data=data)


@router.post("/emails/generate")
async def generate_email(payload: GenerateEmailPayload) -> ApiResponse:
    templates = {
        "Resume Received": (
            "We received your application — TalentPilot Labs",
            f"Dear {payload.candidateName},\n\nThank you for applying. We have received your resume and will review it shortly.\n\nBest regards,\nTalent Acquisition",
        ),
        "Interview Invitation": (
            "Interview Invitation",
            f"Dear {payload.candidateName},\n\nWe would like to invite you to an interview. Please share your availability.\n\nBest regards,\nTalent Acquisition",
        ),
        "Interview Completed": (
            "Thank you for interviewing",
            f"Dear {payload.candidateName},\n\nThank you for speaking with us. We will follow up after the hiring panel reviews feedback.\n\nBest regards,\nTalent Acquisition",
        ),
        "Offer Congratulation": (
            "Congratulations — offer from TalentPilot Labs",
            f"Dear {payload.candidateName},\n\nCongratulations! We are excited to move forward with an offer.\n\nWarm regards,\nPeople Team",
        ),
        "Rejection": (
            "Update on your application",
            f"Dear {payload.candidateName},\n\nThank you for your interest. After careful consideration, we will not be moving forward at this time.\n\nKind regards,\nTalent Acquisition",
        ),
    }
    subject, body = templates[payload.event]
    email = {
        "id": f"em-{uuid.uuid4().hex[:8]}",
        "candidateId": "api",
        "candidateName": payload.candidateName,
        "event": payload.event,
        "subject": subject,
        "body": body,
        "status": "Pending",
        "createdAt": _now(),
    }
    _emails.insert(0, email)
    return ApiResponse(success=True, data=email)


@router.get("/reminders")
async def reminders() -> ApiResponse:
    from services.automation_data import REMINDERS

    return ApiResponse(success=True, data=REMINDERS)


@router.get("/followups")
async def followups() -> ApiResponse:
    from services.automation_data import FOLLOWUPS

    return ApiResponse(success=True, data=FOLLOWUPS)


@router.get("/schedules")
async def schedules() -> ApiResponse:
    from services.automation_data import SCHEDULES

    return ApiResponse(success=True, data=SCHEDULES)


@router.post("/schedules/{schedule_id}/confirm")
async def confirm_schedule(schedule_id: str) -> ApiResponse:
    from services.automation_data import SCHEDULES

    for s in SCHEDULES:
        if s["id"] == schedule_id:
            updated = {**s, "confirmed": True}
            return ApiResponse(success=True, data=updated)
    raise HTTPException(status_code=404, detail="Schedule not found")


@router.get("/evaluations")
async def evaluations() -> ApiResponse:
    from services.automation_data import EVALUATIONS

    return ApiResponse(success=True, data=_evals or EVALUATIONS)


@router.post("/evaluations")
async def create_evaluation(payload: EvalPayload) -> ApiResponse:
    result = {
        "id": f"ev-{uuid.uuid4().hex[:8]}",
        "candidateId": "api",
        "candidateName": payload.candidateName,
        "summary": f"Based on interviewer notes: {(payload.notes or 'Solid overall performance.')[:160]}",
        "strengths": ["Clear communication", "Relevant experience"],
        "weaknesses": ["Needs deeper system design"],
        "communication": 85,
        "technical": 82,
        "cultureFit": 88,
        "confidence": 0.8,
        "recommendation": "Recommended",
        "notes": payload.notes,
    }
    _evals.insert(0, result)
    return ApiResponse(success=True, data=result)


@router.get("/offers")
async def offers() -> ApiResponse:
    from services.automation_data import OFFERS

    return ApiResponse(success=True, data=_offers or OFFERS)


@router.post("/offers")
async def create_offer(payload: OfferPayload) -> ApiResponse:
    from services.automation_data import OFFERS

    base = OFFERS[0]
    offer = {
        **base,
        "id": f"of-{uuid.uuid4().hex[:8]}",
        "candidateName": payload.candidateName,
        "role": payload.role,
        "status": "Draft",
        "letterBody": base["letterBody"].replace("Emily Johnson", payload.candidateName),
    }
    _offers.insert(0, offer)
    return ApiResponse(success=True, data=offer)


@router.get("/activity")
async def activity() -> ApiResponse:
    from services.automation_data import ACTIVITY

    return ApiResponse(success=True, data=ACTIVITY)


@router.get("/notifications")
async def notifications() -> ApiResponse:
    from services.automation_data import NOTIFICATIONS

    return ApiResponse(success=True, data=NOTIFICATIONS)


@router.get("/stats")
async def stats() -> ApiResponse:
    return ApiResponse(
        success=True,
        data={
            "emailsSentToday": 12,
            "pendingFollowUps": 3,
            "upcomingInterviews": 4,
            "candidatesWaiting": 5,
            "offerLettersSent": 1,
            "automationSuccessRate": 96,
        },
    )


@router.get("/pipeline")
async def pipeline() -> ApiResponse:
    from services.automation_data import PIPELINE

    return ApiResponse(success=True, data=PIPELINE)
