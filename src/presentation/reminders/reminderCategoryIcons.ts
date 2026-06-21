import type { ReminderCategory } from "@dog-care/domain";
import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type ReminderCategoryIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

export const REMINDER_CATEGORY_ICONS: Record<ReminderCategory, ReminderCategoryIcon> = {
  feeding: "food-variant",
  walk: "walk",
  vet: "medical-bag",
  treatment: "pill",
  birthday: "cake-variant",
  other: "bell-outline",
};
