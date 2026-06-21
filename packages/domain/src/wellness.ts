import type { MedicationCourse, WellnessEntry, WeightEntry } from "./domain";
import { endOfLocalDay } from "@dog-care/core/utils";

export function sortWellnessEntries(entries: WellnessEntry[]) {
  return [...entries].sort((first, second) => second.at - first.at);
}

export function hasWellnessSymptoms(entry: WellnessEntry) {
  return (
    entry.appetite !== "normal" ||
    entry.activity !== "normal" ||
    entry.stool !== "normal" ||
    entry.vomiting ||
    entry.itching ||
    Boolean(entry.temperature && (entry.temperature < 37.5 || entry.temperature > 39.2))
  );
}

export function getWellnessEntryContext(
  entry: WellnessEntry,
  weightEntries: WeightEntry[],
  medicationCourses: MedicationCourse[]
) {
  const nearestWeight = [...weightEntries]
    .filter((weight) => weight.at <= endOfLocalDay(entry.at))
    .sort((first, second) => second.at - first.at)[0];
  const activeMedications = medicationCourses.filter(
    (course) => course.startAt <= entry.at && entry.at <= course.endAt
  );

  return { nearestWeight, activeMedications };
}
