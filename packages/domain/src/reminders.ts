import type { Reminder, ReminderRepeat } from "./domain";
import { isBeforeToday, isSameLocalDay } from "@dog-care/core/utils";

export function getNextReminderDueAt(dueAt: number, repeat: ReminderRepeat) {
  const next = new Date(Math.max(dueAt, Date.now()));
  if (repeat === "daily") {
    next.setDate(next.getDate() + 1);
  } else if (repeat === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (repeat === "monthly") {
    next.setMonth(next.getMonth() + 1);
  }
  return next.getTime();
}

export function buildReminderStats(reminders: Reminder[], now = Date.now()) {
  const activeReminders = reminders.filter((reminder) => !reminder.completedAt);
  return {
    active: activeReminders.length,
    today: activeReminders.filter((reminder) => isSameLocalDay(reminder.dueAt, now)).length,
    dueNow: activeReminders.filter(
      (reminder) => reminder.dueAt <= now && !isBeforeToday(reminder.dueAt, now)
    ).length,
    overdue: activeReminders.filter((reminder) => isBeforeToday(reminder.dueAt, now)).length,
  };
}

export function sortReminders(reminders: Reminder[]) {
  return [...reminders].sort((a, b) => {
    if (Boolean(a.completedAt) !== Boolean(b.completedAt)) {
      return a.completedAt ? 1 : -1;
    }
    return a.dueAt - b.dueAt;
  });
}

export function getDayPlanReminders(reminders: Reminder[], now = Date.now()) {
  return sortReminders(
    reminders.filter(
      (reminder) =>
        !reminder.completedAt &&
        (isSameLocalDay(reminder.dueAt, now) || isBeforeToday(reminder.dueAt, now))
    )
  );
}

export function parseReminderDateTime(dateValue: string, timeValue: string) {
  const dateMatch = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(dateValue);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(timeValue);
  if (!dateMatch || !timeMatch) return null;

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);
  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);
  const parsed = new Date(year, month - 1, day, hours, minutes, 0, 0);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day ||
    parsed.getHours() !== hours ||
    parsed.getMinutes() !== minutes
  ) {
    return null;
  }

  return parsed.getTime();
}

export function formatReminderDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const segments = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return segments.join(".");
}

export function formatReminderTimeInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);
  return minutes ? `${hours}:${minutes}` : hours;
}

export function formatReminderDateForInput(timestamp: number) {
  const date = new Date(timestamp);
  return [
    pad2(date.getDate()),
    pad2(date.getMonth() + 1),
    date.getFullYear(),
  ].join(".");
}

export function formatReminderTimeForInput(timestamp: number) {
  const date = new Date(timestamp);
  return [pad2(date.getHours()), pad2(date.getMinutes())].join(":");
}

function pad2(value: number) {
  return value.toString().padStart(2, "0");
}
