from datetime import datetime

from fastapi import APIRouter

from app.schemas import StatsResponse
from app.services.scanner import scan_projects
from app.services.stats import build_stats

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsResponse)
def get_stats() -> StatsResponse:
    data = build_stats(scan_projects())
    return StatsResponse(
        scanned_projects=int(data["scanned_projects"]),
        average_health=int(data["average_health"]),
        critical_count=int(data["critical_count"]),
        warning_count=int(data["warning_count"]),
        dirty_repo_count=int(data["dirty_repo_count"]),
        stale_repo_count=int(data["stale_repo_count"]),
        scanned_at=datetime.fromisoformat(str(data["scanned_at"])),
    )
