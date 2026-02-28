from datetime import datetime

from fastapi import APIRouter

from app.schemas import TimelineResponse
from app.services.scanner import scan_projects
from app.services.timeline import build_timeline

router = APIRouter(prefix="/timeline", tags=["timeline"])


@router.get("", response_model=list[TimelineResponse])
def list_timeline() -> list[TimelineResponse]:
    timeline = build_timeline(scan_projects())
    return [
        TimelineResponse(
            id=item["id"],
            project_id=item["project_id"],
            project_name=item["project_name"],
            commit_at=datetime.fromisoformat(item["commit_at"]),
            commit_message=item["commit_message"],
        )
        for item in timeline
    ]
