from app.models import ProjectSnapshot


def build_actions(projects: list[ProjectSnapshot]) -> list[dict[str, str | int]]:
    high_risk = sorted(projects, key=lambda p: p.risk_score, reverse=True)[:8]
    actions: list[dict[str, str | int]] = []
    for idx, project in enumerate(high_risk):
        impact = "high" if idx < 2 else "medium" if idx < 5 else "low"
        actions.append(
            {
                "id": f"{project.project_id}-{idx}",
                "title": f"{project.name} の品質改善",
                "impact": impact,
                "project_id": project.project_id,
                "project_name": project.name,
                "score_delta_estimate": min(20, max(3, project.risk_score // 8)),
            }
        )
    return actions


def build_playbook(actions: list[dict[str, str | int]]) -> list[dict[str, str | list[str]]]:
    weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    result: list[dict[str, str | list[str]]] = []
    for i, day in enumerate(weekdays):
        if i < len(actions):
            action = actions[i]
            result.append(
                {
                    "day": day,
                    "focus": str(action["project_name"]),
                    "actions": [
                        str(action["title"]),
                        "lint / test / build を実行",
                        "改善内容を短くコミット",
                    ],
                }
            )
        else:
            result.append(
                {
                    "day": day,
                    "focus": "Maintenance",
                    "actions": ["未処理タスクの解消", "次週の優先順位更新"],
                }
            )
    return result
