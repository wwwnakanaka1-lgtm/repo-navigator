from dataclasses import dataclass
from datetime import datetime


@dataclass
class ProjectSnapshot:
    project_id: str
    name: str
    health_score: int
    risk_score: int
    dirty_files: int
    open_todos: int
    last_commit_at: datetime | None
