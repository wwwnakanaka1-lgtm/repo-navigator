import { ActionItem, PlaybookDay } from "@/lib/types";

export function buildWeekPlan(actions: ActionItem[]): PlaybookDay[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map((day, idx) => {
    const action = actions[idx];
    if (!action) {
      return {
        day,
        focus: "Stability",
        actions: ["未完了タスクの解消", "改善結果のレビュー"],
      };
    }

    return {
      day,
      focus: action.projectName,
      actions: [action.title, action.description],
    };
  });
}
