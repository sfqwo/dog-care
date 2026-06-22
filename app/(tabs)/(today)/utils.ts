import type { CompletedCareTask } from "@dog-care/domain";
import {
  REMINDER_CATEGORY_ICONS,
  type ReminderCategoryIcon,
} from "@/src/presentation/reminders";

export type CompletedSourceIcon = ReminderCategoryIcon | "check-circle-outline";

export function getCompletedSourceIcon(item: CompletedCareTask): CompletedSourceIcon {
  if (item.category) return REMINDER_CATEGORY_ICONS[item.category];
  if (item.source === "feeding") return "food-variant";
  if (item.source === "walk") return "walk";
  if (item.source === "vet") return "medical-bag";
  return "check-circle-outline";
}
