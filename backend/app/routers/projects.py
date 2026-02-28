from fastapi import APIRouter, HTTPException

from app.schemas import ProjectResponse
from app.services.scanner import scan_projects

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectResponse])
def list_projects() -> list[ProjectResponse]:
    projects = scan_projects()
    return [
        ProjectResponse(
            id=p.project_id,
            name=p.name,
            health_score=p.health_score,
            risk_score=p.risk_score,
            dirty_files=p.dirty_files,
            open_todos=p.open_todos,
            last_commit_at=p.last_commit_at,
        )
        for p in projects
    ]


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str) -> ProjectResponse:
    for project in scan_projects():
        if project.project_id == project_id:
            return ProjectResponse(
                id=project.project_id,
                name=project.name,
                health_score=project.health_score,
                risk_score=project.risk_score,
                dirty_files=project.dirty_files,
                open_todos=project.open_todos,
                last_commit_at=project.last_commit_at,
            )
    raise HTTPException(status_code=404, detail="Project not found")
