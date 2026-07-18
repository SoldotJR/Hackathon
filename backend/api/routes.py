from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response

from database.store import store
from schemas.recruitment import ApiResponse, GeneratePlanPayload
from services.recruitment_service import recruitment_service
from services.report import build_csv_candidates, build_pdf_report

router = APIRouter(prefix="/api", tags=["recruitment"])


@router.post("/recruit")
async def recruit(payload: GeneratePlanPayload) -> ApiResponse:
    plan = await recruitment_service.recruit(
        request=payload.request,
        resume_ids=payload.resume_ids,
    )
    return ApiResponse(
        success=True,
        data=plan.model_dump(),
        message="Recruitment plan generated successfully",
    )


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)) -> ApiResponse:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename required")
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    result = await recruitment_service.upload_resume(file.filename, data)
    return ApiResponse(success=True, data=result, message="Resume uploaded")


@router.get("/candidates")
async def list_candidates() -> ApiResponse:
    candidates = store.all_candidates()
    return ApiResponse(
        success=True,
        data=[c.model_dump() for c in candidates],
        message="OK",
    )


@router.get("/candidates/{candidate_id}")
async def get_candidate(candidate_id: str) -> ApiResponse:
    for c in store.all_candidates():
        if c.id == candidate_id:
            return ApiResponse(success=True, data=c.model_dump())
    raise HTTPException(status_code=404, detail="Candidate not found")


@router.get("/workflow")
async def get_workflow() -> ApiResponse:
    agents = recruitment_service.get_workflow()
    return ApiResponse(
        success=True,
        data=[a.model_dump() for a in agents],
    )


@router.get("/report")
async def get_report(format: str = "json", plan_id: str | None = None) -> Response:
    plan = store.get_plan(plan_id)
    if not plan:
        raise HTTPException(
            status_code=404,
            detail="No recruitment plan found. Run POST /api/recruit first.",
        )

    fmt = format.lower()
    if fmt == "pdf":
        pdf = build_pdf_report(plan)
        return Response(
            content=pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="talentpilot-{plan.id}.pdf"'
            },
        )
    if fmt == "csv":
        csv_data = build_csv_candidates(plan)
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={
                "Content-Disposition": f'attachment; filename="talentpilot-{plan.id}.csv"'
            },
        )

    return Response(
        content=ApiResponse(
            success=True,
            data=plan.model_dump(),
            message="Recruitment report",
        ).model_dump_json(),
        media_type="application/json",
    )


@router.get("/analytics")
async def get_analytics() -> ApiResponse:
    return ApiResponse(success=True, data=store.analytics().model_dump())


@router.get("/stats")
async def get_stats() -> ApiResponse:
    return ApiResponse(success=True, data=store.dashboard_stats().model_dump())


@router.get("/plan")
async def get_latest_plan() -> ApiResponse:
    plan = store.get_plan()
    if not plan:
        raise HTTPException(status_code=404, detail="No plan yet")
    return ApiResponse(success=True, data=plan.model_dump())


@router.get("/health")
async def health() -> dict:
    from services.llm import get_llm

    return {
        "status": "ok",
        "service": "TalentPilot AI",
        "llm_provider": get_llm().provider,
    }
