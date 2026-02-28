from fastapi import APIRouter

from app.schemas import PlaybookDayResponse
from app.services.recommendation import build_actions, build_playbook
from app.services.scanner import scan_projects

router = APIRouter(prefix="/playbook", tags=["playbook"])


@router.get("", response_model=list[PlaybookDayResponse])
def get_playbook() -> list[PlaybookDayResponse]:
    actions = build_actions(scan_projects())
    playbook = build_playbook(actions)
    return [
        PlaybookDayResponse(
            day=str(item["day"]),
            focus=str(item["focus"]),
            actions=[str(action) for action in item["actions"]],
        )
        for item in playbook
    ]
