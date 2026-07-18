"""Recruitment domain service — no business logic in routes."""

from __future__ import annotations

import uuid
from pathlib import Path
from typing import Any

import aiofiles

from agents.master_agent import MasterRecruitmentAgent, initial_agents
from database.store import store
from schemas.recruitment import RecruitmentPlan, WorkflowAgent
from services.resume_parser import extract_text_from_bytes
from utils.config import get_settings


class RecruitmentService:
    def __init__(self) -> None:
        self.master = MasterRecruitmentAgent()

    async def upload_resume(self, filename: str, data: bytes) -> dict[str, Any]:
        settings = get_settings()
        upload_dir = Path(settings.upload_dir)
        upload_dir.mkdir(parents=True, exist_ok=True)

        resume_id = f"res-{uuid.uuid4().hex[:10]}"
        safe_name = Path(filename).name
        dest = upload_dir / f"{resume_id}_{safe_name}"

        async with aiofiles.open(dest, "wb") as f:
            await f.write(data)

        text, pages = extract_text_from_bytes(data, safe_name)
        record = {
            "id": resume_id,
            "filename": safe_name,
            "path": str(dest),
            "text": text,
            "pages": pages,
            "textPreview": (text[:400] + "…") if len(text) > 400 else text,
        }
        store.resumes[resume_id] = record
        return {
            "id": resume_id,
            "filename": safe_name,
            "textPreview": record["textPreview"],
            "pages": pages,
            "parsed": None,
        }

    async def recruit(
        self, request: str, resume_ids: list[str] | None = None
    ) -> RecruitmentPlan:
        uploaded = []
        for rid in resume_ids or []:
            if rid in store.resumes:
                uploaded.append(store.resumes[rid])

        async def on_progress(agents: list[WorkflowAgent], active_id: str | None) -> None:
            store.workflow = [a.model_copy() for a in agents]

        plan = await self.master.run(
            request=request,
            uploaded_resumes=uploaded,
            on_progress=on_progress,
        )
        store.save_plan(plan)
        return plan

    def get_workflow(self) -> list[WorkflowAgent]:
        plan = store.get_plan()
        if plan:
            return plan.agents
        return initial_agents()


recruitment_service = RecruitmentService()
