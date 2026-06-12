import type { CompletedCareTask, Reminder } from "@dog-care/types";

export type TodayPlanItemProps = {
  reminder: Reminder;
  onOpen: (reminder: Reminder) => void;
  onComplete: (id: string) => void;
  onRemove: (id: string) => void;
};

export type TodayCompletedItemProps = {
  item: CompletedCareTask;
};
