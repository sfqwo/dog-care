import type { Reminder, ReminderRepeat } from "./domain";
import { createClampedLocalDate, isBeforeToday, isSameLocalDay } from "@dog-care/core/utils";

export function getNextReminderDueAt(
  dueAt: number,
  repeat: ReminderRepeat,
  yearlyMonth?: number,
  yearlyDay?: number
) {
  if (repeat === "yearly" && yearlyMonth && yearlyDay) {
    return getNextYearlyDueAt(dueAt, yearlyMonth, yearlyDay);
  }
  const next = new Date(Math.max(dueAt, Date.now()));
  if (repeat === "daily") {
    next.setDate(next.getDate() + 1);
  } else if (repeat === "weekly") {
    next.setDate(next.getDate() + 7);
  } else if (repeat === "monthly") {
    next.setMonth(next.getMonth() + 1);
  } else if (repeat === "yearly") {
    next.setFullYear(next.getFullYear() + 1);
  }
  return next.getTime();
}

function getNextYearlyDueAt(dueAt: number, month: number, day: number) {
  const now = new Date();
  const dueDate = new Date(dueAt);
  let next = createYearlyOccurrence(
    now.getFullYear(),
    month,
    day,
    dueDate.getHours(),
    dueDate.getMinutes()
  );
  if (next.getTime() <= now.getTime()) {
    next = createYearlyOccurrence(
      now.getFullYear() + 1,
      month,
      day,
      dueDate.getHours(),
      dueDate.getMinutes()
    );
  }
  return next.getTime();
}

function createYearlyOccurrence(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number
) {
  return createClampedLocalDate(year, month - 1, day, hours, minutes);
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
