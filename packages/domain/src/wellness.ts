import type { MedicationCourse, WellnessEntry, WeightEntry } from "./domain";
import { endOfLocalDay } from "@dog-care/core/utils";

export function sortWellnessEntries(entries: WellnessEntry[]) {
  return [...entries].sort((first, second) => second.at - first.at);
}

export function hasWellnessSymptoms(entry: WellnessEntry) {
  return getWellnessSymptomScore(entry) > 0;
}

export function getWellnessSymptomScore(entry: WellnessEntry) {
  const appetiteScore = entry.appetite === "none"
    ? 2
    : entry.appetite === "normal" ? 0 : 1;
  const activityScore = entry.activity === "low"
    ? 2
    : entry.activity === "normal" ? 0 : 1;
  const stoolScore = entry.stool === "normal"
    ? 0
    : entry.stool === "soft" ? 1 : 2;
  const temperatureScore = entry.temperature &&
    (entry.temperature < 37.5 || entry.temperature > 39.2)
    ? 2
    : 0;

  return appetiteScore +
    activityScore +
    stoolScore +
    (entry.vomiting ? 2 : 0) +
    (entry.itching ? 1 : 0) +
    temperatureScore;
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
