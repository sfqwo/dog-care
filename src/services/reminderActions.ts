import type { CompletedCareTask, Reminder } from "@dog-care/types";
import {
  getNextReminderDueAt,
  REMINDER_CATEGORY_LABELS,
} from "@/packages/core";
import { createUid } from "@dog-care/core/utils";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import {
  cancelReminderNotification,
  scheduleReminderNotification,
} from "./reminderNotifications";

type CompletedTasksByPet = Record<string, CompletedCareTask[]>;
type CompleteReminderInListOptions = {
  onCompletedTask?: (petId: string, task: CompletedCareTask) => void;
};

export async function removeReminderFromList(reminders: Reminder[], id: string) {
  const reminder = reminders.find((item) => item.id === id);
  await cancelReminderNotification(reminder?.notificationId);
  return reminders.filter((item) => item.id !== id);
}

export async function completeReminderInList(
  reminders: Reminder[],
  id: string,
  options: CompleteReminderInListOptions = {}
) {
  const reminder = reminders.find((item) => item.id === id);
  if (!reminder) return reminders;

  await cancelReminderNotification(reminder.notificationId);
  const completedTask = createCompletedReminderTask(reminder);
  if (options.onCompletedTask) {
    options.onCompletedTask(reminder.petId, completedTask);
  } else {
    await appendCompletedReminderTask(reminder.petId, completedTask);
  }

  if (reminder.repeat === "none") {
    return reminders.filter((item) => item.id !== id);
  }

  const nextReminder: Reminder = {
    ...reminder,
    dueAt: getNextReminderDueAt(reminder.dueAt, reminder.repeat),
    completedAt: undefined,
    notificationId: undefined,
  };
  const notificationId = await scheduleReminderNotification({
    reminder: nextReminder,
    categoryLabel: REMINDER_CATEGORY_LABELS[nextReminder.category],
  });

  return reminders.map((item) =>
    item.id === id ? { ...nextReminder, notificationId } : item
  );
}

async function appendCompletedReminderTask(petId: string, completedTask: CompletedCareTask) {
  const stored = await loadJSON<CompletedTasksByPet>(STORAGE_KEYS.COMPLETED_TASKS, {});
  const current = stored[petId] ?? [];

  await saveJSON(STORAGE_KEYS.COMPLETED_TASKS, {
    ...stored,
    [petId]: [completedTask, ...current],
  });
}

function createCompletedReminderTask(reminder: Reminder): CompletedCareTask {
  const completedTask: CompletedCareTask = {
    id: createUid(),
    petId: reminder.petId,
    title: reminder.title,
    completedAt: Date.now(),
    source: "reminder",
    category: reminder.category,
    note: reminder.note,
    detail: REMINDER_CATEGORY_LABELS[reminder.category],
  };
  return completedTask;
}
