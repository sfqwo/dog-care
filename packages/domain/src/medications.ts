import { endOfLocalDay, parseDateTimeInput, startOfLocalDay } from "@dog-care/core/utils";
import type { MedicationCourse } from "./domain";

export type MedicationCourseStatus = "planned" | "active" | "completed";

export function parseMedicationCourseSchedule(
  startDate: string,
  endDate: string,
  time: string,
  now = Date.now()
) {
  const firstDoseAt = parseDateTimeInput(startDate, time);
  const lastDoseAt = parseDateTimeInput(endDate, time);
  if (!firstDoseAt || !lastDoseAt || lastDoseAt < firstDoseAt) return null;

  const endAt = endOfLocalDay(lastDoseAt);

  let nextDoseAt = firstDoseAt;
  while (nextDoseAt < now && nextDoseAt <= endAt) {
    const next = new Date(nextDoseAt);
    next.setDate(next.getDate() + 1);
    nextDoseAt = next.getTime();
  }

  return {
    startAt: startOfLocalDay(firstDoseAt),
    endAt,
    nextDoseAt: nextDoseAt <= endAt ? nextDoseAt : null,
  };
}

export function getMedicationCourseStatus(
  course: MedicationCourse,
  now = Date.now()
): MedicationCourseStatus {
  if (now < course.startAt) return "planned";
  if (now > course.endAt) return "completed";
  return "active";
}

export function sortMedicationCourses(courses: MedicationCourse[]) {
  const statusOrder: Record<MedicationCourseStatus, number> = {
    active: 0,
    planned: 1,
    completed: 2,
  };

  return [...courses].sort((first, second) => {
    const statusDelta = statusOrder[getMedicationCourseStatus(first)] - statusOrder[getMedicationCourseStatus(second)];
    return statusDelta || first.startAt - second.startAt;
  });
}
