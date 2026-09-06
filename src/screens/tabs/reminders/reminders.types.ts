import type { CompletedCareTask, Reminder } from "@dog-care/domain";

export type ReminderListItemProps = {
  reminder: Reminder;
  onRemove: (id: string) => void;
  onToggleDone: (id: string) => void;
  onOpen: (reminder: Reminder) => void;
};

export type CompletedReminderListItemProps = {
  item: CompletedCareTask;
  onRemove: (id: string) => void;
};
