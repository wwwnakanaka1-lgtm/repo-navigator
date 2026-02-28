from datetime import datetime

from app.models import ProjectSnapshot


def build_stats(projects: list[ProjectSnapshot]) -> dict[str, int | str]:
    if not projects:
        return {
            "scanned_projects": 0,
            "average_health": 0,
            "critical_count": 0,
            "warning_count": 0,
            "dirty_repo_count": 0,
            "stale_repo_count": 0,
            "scanned_at": datetime.utcnow().isoformat(),
        }

    average = round(sum(project.health_score for project in projects) / len(projects))
    return {
        "scanned_projects": len(projects),
        "average_health": average,
        "critical_count": len([p for p in projects if p.health_score < 50]),
        "warning_count": len([p for p in projects if 50 <= p.health_score < 70]),
        "dirty_repo_count": len([p for p in projects if p.dirty_files > 0]),
        "stale_repo_count": len([p for p in projects if p.last_commit_at and (datetime.utcnow() - p.last_commit_at).days > 14]),
        "scanned_at": datetime.utcnow().isoformat(),
    }
