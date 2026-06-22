import type { Reminder } from "@dog-care/domain";
import { REMINDER_CATEGORY_LABELS } from "@dog-care/core/shared";
import { scheduleReminderNotification } from "./reminderNotifications";

export function scheduleBirthdayNotification(reminder: Reminder) {
  return scheduleReminderNotification({
    reminder,
    categoryLabel: REMINDER_CATEGORY_LABELS.birthday,
    requestPermission: false,
  });
}
