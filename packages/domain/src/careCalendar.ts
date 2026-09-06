import {
  endOfLocalDay,
  formatDateInputFromTimestamp,
  formatLocalDate,
  formatTimeInputFromTimestamp,
  isSameLocalDay,
  parseDateTimeInput,
  startOfLocalDay,
} from "@dog-care/core/utils";
import type {
  CompletedCareTask,
  Feeding,
  MedicationCourse,
  Reminder,
  ReminderCategory,
  VetRecord,
  Walk,
} from "./domain";
import { getCompletedSourceId } from "./carePlan";

export type CareCalendarEventKind =
  | "feeding"
  | "walk"
  | "vet"
  | "medication"
  | "reminder"
  | "completed";

export type CareCalendarEventStatus = "planned" | "done" | "notDone";

export type CareCalendarEvent = {
  id: string;
  kind: CareCalendarEventKind;
  title: string;
  subtitle: string;
  at: number;
  status: CareCalendarEventStatus;
  category?: ReminderCategory;
  note?: string;
  detail?: string;
  sourceId?: string;
  canComplete: boolean;
  canRemove: boolean;
};

export type BuildCareCalendarDayParams = {
  date: number;
  feedings: Feeding[];
  walks: Walk[];
  vetRecords: VetRecord[];
  medicationCourses: MedicationCourse[];
  reminders: Reminder[];
  completedTasks: CompletedCareTask[];
  now?: number;
};

export function buildCareCalendarDay({
  date,
  feedings,
  walks,
  vetRecords,
  medicationCourses,
  reminders,
  completedTasks,
  now = Date.now(),
}: BuildCareCalendarDayParams) {
  const dayStart = startOfLocalDay(date);
  const dayEnd = endOfLocalDay(date);
  const completedReminderIds = getCompletedReminderIds(completedTasks, dayStart);
  const completedVetIds = getCompletedVetIds(completedTasks);

  return [
    ...feedings
      .filter((item) => isSameLocalDay(item.at, dayStart))
      .map<CareCalendarEvent>((item) => ({
        id: `feeding-${item.id}`,
        kind: "feeding",
        title: "Кормление",
        subtitle: `${formatTimeInputFromTimestamp(item.at)} • ${item.grams} г`,
        at: item.at,
        status: "done",
        category: "feeding",
        note: item.food,
        detail: `${item.grams} г`,
        sourceId: item.id,
        canComplete: false,
        canRemove: true,
      })),
    ...walks
      .filter((item) => isSameLocalDay(item.startedAt, dayStart))
      .map<CareCalendarEvent>((item) => ({
        id: `walk-${item.id}`,
        kind: "walk",
        title: "Прогулка",
        subtitle: `${formatTimeInputFromTimestamp(item.startedAt)} • ${item.durationMin} мин`,
        at: item.startedAt,
        status: "done",
        category: "walk",
        note: item.note,
        detail: `${item.durationMin} мин`,
        sourceId: item.id,
        canComplete: false,
        canRemove: true,
      })),
    ...vetRecords
      .map((record) => ({
        record,
        scheduledAt: parseDateTimeInput(record.date, record.time) ?? record.at,
      }))
      .filter((item) => isSameLocalDay(item.scheduledAt, dayStart))
      .map<CareCalendarEvent>(({ record, scheduledAt }) => {
        const isDone = completedVetIds.has(record.id);
        return {
          id: `vet-${record.id}`,
          kind: "vet",
          title: record.title,
          subtitle: `${formatTimeInputFromTimestamp(scheduledAt)} • Ветвизит`,
          at: scheduledAt,
          status: getPlannedStatus(scheduledAt, now, isDone),
          category: "vet",
          note: record.note ?? record.clinic,
          sourceId: record.id,
          canComplete: !isDone && scheduledAt <= now,
          canRemove: true,
        };
      }),
    ...medicationCourses
      .filter((course) => course.startAt <= dayEnd && course.endAt >= dayStart)
      .map<CareCalendarEvent>((course) => {
        const at = parseDateTimeInput(formatDateInputFromTimestamp(dayStart), course.time) ?? dayStart;
        return {
          id: `medication-${course.id}-${dayStart}`,
          kind: "medication",
          title: course.name,
          subtitle: `${course.time} • ${course.dosage}`,
          at,
          status: at > now ? "planned" : "notDone",
          category: "treatment",
          note: course.note,
          detail: course.dosage,
          sourceId: course.id,
          canComplete: false,
          canRemove: false,
        };
      }),
    ...reminders
      .filter((reminder) => isSameLocalDay(reminder.dueAt, dayStart))
      .map<CareCalendarEvent>((reminder) => {
        const isDone = Boolean(reminder.completedAt) || completedReminderIds.has(reminder.id);
        return {
          id: `reminder-${reminder.id}`,
          kind: "reminder",
          title: reminder.title,
          subtitle: `${formatTimeInputFromTimestamp(reminder.dueAt)} • Напоминание`,
          at: reminder.dueAt,
          status: getPlannedStatus(reminder.dueAt, now, isDone),
          category: reminder.category,
          note: reminder.note,
          sourceId: reminder.id,
          canComplete: !isDone && reminder.dueAt <= now,
          canRemove: reminder.category !== "birthday",
        };
      }),
    ...completedTasks
      .filter((task) => isSameLocalDay(task.completedAt, dayStart))
      .map<CareCalendarEvent>((task) => ({
        id: `completed-${task.id}`,
        kind: "completed",
        title: task.title,
        subtitle: `${formatTimeInputFromTimestamp(task.completedAt)} • Выполнено`,
        at: task.completedAt,
        status: "done",
        category: task.category,
        note: task.note,
        detail: task.detail,
        sourceId: getCompletedSourceId(task),
        canComplete: false,
        canRemove: true,
      })),
  ].sort((a, b) => a.at - b.at);
}

export function buildCalendarWeek(selectedDate: number, now = Date.now()) {
  const selectedDay = startOfLocalDay(selectedDate);
  const selected = new Date(selectedDay);
  const mondayOffset = (selected.getDay() + 6) % 7;
  const monday = new Date(selectedDay);
  monday.setDate(selected.getDate() - mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const timestamp = date.getTime();
    return {
      timestamp,
      dayNumber: date.getDate().toString(),
      weekDay: formatLocalDate(timestamp, { weekday: "short" }),
      isSelected: isSameLocalDay(timestamp, selectedDay),
      isToday: isSameLocalDay(timestamp, now),
    };
  });
}

function getCompletedReminderIds(completedTasks: CompletedCareTask[], dayStart: number) {
  return new Set(
    completedTasks
      .filter((task) => task.source === "reminder" && isSameLocalDay(task.completedAt, dayStart))
      .map((task) => task.sourceRefId)
      .filter(Boolean)
  );
}

function getCompletedVetIds(completedTasks: CompletedCareTask[]) {
  return new Set(
    completedTasks
      .filter((task) => task.source === "vet")
      .map(getCompletedSourceId)
  );
}

function getPlannedStatus(at: number, now: number, isDone: boolean): CareCalendarEventStatus {
  if (isDone) return "done";
  return at > now ? "planned" : "notDone";
}
