from datetime import datetime, timedelta
from pathlib import Path

from app.core.config import settings
from app.models import ProjectSnapshot


def _score_from_name(name: str) -> int:
    checksum = sum(ord(ch) for ch in name)
    return 55 + (checksum % 40)


def scan_projects() -> list[ProjectSnapshot]:
    root = Path(settings.scan_root)
    snapshots: list[ProjectSnapshot] = []
    if not root.exists():
        return snapshots

    for item in sorted(root.iterdir()):
        if not item.is_dir():
            continue
        health = _score_from_name(item.name)
        risk = max(0, 100 - health)
        dirty = (len(item.name) * 2) % 7
        todos = len(item.name) % 11
        snapshots.append(
            ProjectSnapshot(
                project_id=item.name,
                name=item.name.replace("-", " ").title(),
                health_score=health,
                risk_score=risk,
                dirty_files=dirty,
                open_todos=todos,
                last_commit_at=datetime.utcnow() - timedelta(days=len(item.name) % 20),
            )
        )
    return snapshots
