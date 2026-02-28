from fastapi import APIRouter

from app.schemas import ActionResponse
from app.services.recommendation import build_actions
from app.services.scanner import scan_projects

router = APIRouter(prefix="/actions", tags=["actions"])


@router.get("", response_model=list[ActionResponse])
def list_actions() -> list[ActionResponse]:
    actions = build_actions(scan_projects())
    return [
        ActionResponse(
            id=str(action["id"]),
            title=str(action["title"]),
            impact=str(action["impact"]),
            project_id=str(action["project_id"]),
            project_name=str(action["project_name"]),
            score_delta_estimate=int(action["score_delta_estimate"]),
        )
        for action in actions
    ]
