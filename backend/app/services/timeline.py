from app.models import ProjectSnapshot


def build_timeline(projects: list[ProjectSnapshot]) -> list[dict[str, str]]:
    timeline: list[dict[str, str]] = []
    for project in projects:
        if not project.last_commit_at:
            continue
        timeline.append(
            {
                "id": f"{project.project_id}-{project.last_commit_at.isoformat()}",
                "project_id": project.project_id,
                "project_name": project.name,
                "commit_at": project.last_commit_at.isoformat(),
                "commit_message": "Maintenance checkpoint",
            }
        )
    return sorted(timeline, key=lambda item: item["commit_at"], reverse=True)[:30]
