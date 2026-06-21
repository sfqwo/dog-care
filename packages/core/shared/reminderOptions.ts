import type { ReminderCategory, ReminderRepeat } from "@dog-care/domain";

export type ReminderCategoryOption = {
  value: ReminderCategory;
  title: string;
};

export type ReminderRepeatOption = {
  value: ReminderRepeat;
  title: string;
};

export const REMINDER_CATEGORY_OPTIONS: ReminderCategoryOption[] = [
  { value: "feeding", title: "Кормление" },
  { value: "walk", title: "Прогулка" },
  { value: "vet", title: "Ветеринар" },
  { value: "treatment", title: "Лекарство / обработка" },
  { value: "birthday", title: "День рождения" },
  { value: "other", title: "Другое" },
];

export const REMINDER_REPEAT_OPTIONS: ReminderRepeatOption[] = [
  { value: "none", title: "Без повтора" },
  { value: "daily", title: "Каждый день" },
  { value: "weekly", title: "Каждую неделю" },
  { value: "monthly", title: "Каждый месяц" },
  { value: "yearly", title: "Каждый год" },
];

export const REMINDER_CATEGORY_LABELS: Record<ReminderCategory, string> =
  REMINDER_CATEGORY_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.title }),
    {} as Record<ReminderCategory, string>
  );

export const REMINDER_REPEAT_LABELS: Record<ReminderRepeat, string> =
  REMINDER_REPEAT_OPTIONS.reduce(
    (acc, option) => ({ ...acc, [option.value]: option.title }),
    {} as Record<ReminderRepeat, string>
  );

export function getReminderCategoryLabel(category: ReminderCategory) {
  return REMINDER_CATEGORY_LABELS[category];
}

export function isReminderCategory(value: unknown): value is ReminderCategory {
  return typeof value === "string" && value in REMINDER_CATEGORY_LABELS;
}

export type ReminderRoute = "/feeding" | "/walks" | "/vet" | "/vet?section=medications" | "/profile";

export function getReminderRoute(category: ReminderCategory | unknown): ReminderRoute {
  if (!isReminderCategory(category)) return "/profile";
  if (category === "feeding") return "/feeding";
  if (category === "walk") return "/walks";
  if (category === "vet") return "/vet";
  if (category === "treatment") return "/vet?section=medications";
  if (category === "birthday") return "/profile";
  return "/profile";
}
