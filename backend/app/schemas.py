from datetime import datetime
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str
    timestamp: datetime


class ProjectResponse(BaseModel):
    id: str
    name: str
    health_score: int
    risk_score: int
    dirty_files: int
    open_todos: int
    last_commit_at: datetime | None = None


class ActionResponse(BaseModel):
    id: str
    title: str
    impact: str
    project_id: str
    project_name: str
    score_delta_estimate: int


class TimelineResponse(BaseModel):
    id: str
    project_id: str
    project_name: str
    commit_at: datetime
    commit_message: str


class StatsResponse(BaseModel):
    scanned_projects: int
    average_health: int
    critical_count: int
    warning_count: int
    dirty_repo_count: int
    stale_repo_count: int
    scanned_at: datetime


class PlaybookDayResponse(BaseModel):
    day: str
    focus: str
    actions: list[str]
