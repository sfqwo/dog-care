import type {
  CompletedCareTask,
  Feeding,
  Reminder,
  VetRecord,
  Walk,
} from "./domain";
import { isSameLocalDay, parseDateTimeInput } from "@dog-care/core/utils";

export type TodayVetPlanItem = {
  record: VetRecord;
  scheduledAt: number;
};

export function buildCompletedTodayItems({
  feedings,
  walks,
  completedTasks,
  now = Date.now(),
}: {
  feedings: Feeding[];
  walks: Walk[];
  completedTasks: CompletedCareTask[];
  now?: number;
}) {
  const feedingItems = feedings
    .filter((item) => isSameLocalDay(item.at, now))
    .map<CompletedCareTask>((item) => ({
      id: `feeding-${item.id}`,
      petId: item.petId,
      title: "Кормление",
      completedAt: item.at,
      source: "feeding",
      category: "feeding",
      detail: `${item.grams} г`,
      note: item.food,
    }));
  const walkItems = walks
    .filter((item) => isSameLocalDay(item.startedAt, now))
    .map<CompletedCareTask>((item) => ({
      id: `walk-${item.id}`,
      petId: item.petId,
      title: "Прогулка",
      completedAt: item.startedAt,
      source: "walk",
      category: "walk",
      detail: `${item.durationMin} мин`,
      note: item.note,
    }));
  const vetItems = completedTasks
    .filter((item) => item.source === "vet" && isSameLocalDay(item.completedAt, now));

  return [...feedingItems, ...walkItems, ...vetItems]
    .sort((a, b) => b.completedAt - a.completedAt);
}

export function buildVetPlanItems({
  vetRecords,
  completedTasks,
  now = Date.now(),
}: {
  vetRecords: VetRecord[];
  completedTasks: CompletedCareTask[];
  now?: number;
}) {
  const completedVetRecordIds = new Set(
    completedTasks
      .filter((task) => task.source === "vet")
      .map(getCompletedSourceId)
  );

  return vetRecords
    .map<TodayVetPlanItem>((record) => ({
      record,
      scheduledAt: parseDateTimeInput(record.date, record.time) ?? record.at,
    }))
    .filter(
      (item) =>
        isSameLocalDay(item.scheduledAt, now) && !completedVetRecordIds.has(item.record.id)
    )
    .sort((a, b) => a.scheduledAt - b.scheduledAt);
}

export function getNextPlanItemAt(reminders: Reminder[], vetItems: TodayVetPlanItem[]) {
  const timestamps = [
    ...reminders.map((reminder) => reminder.dueAt),
    ...vetItems.map((item) => item.scheduledAt),
  ];
  if (!timestamps.length) return null;
  return Math.min(...timestamps);
}

export function getCompletedSourceId(item: CompletedCareTask) {
  const prefix = `${item.source}-`;
  return item.id.startsWith(prefix) ? item.id.slice(prefix.length) : item.id;
}

export function getCompletedSourceLabel(source: CompletedCareTask["source"]) {
  if (source === "feeding") return "Кормление";
  if (source === "walk") return "Прогулка";
  if (source === "vet") return "Вет";
  return "Напоминание";
}
