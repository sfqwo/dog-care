import {
  formatDateInputFromTimestamp,
  formatTimeInputFromTimestamp,
} from "@dog-care/core/utils";
import type { MedicationCourseForm } from "./types";

export function createInitialMedicationCourseForm(): MedicationCourseForm {
  const reminderAt = new Date(Date.now() + 5 * 60 * 1000);
  const end = new Date(reminderAt);
  end.setDate(end.getDate() + 6);
  return {
    name: "",
    dosage: "",
    startDate: formatDateInputFromTimestamp(reminderAt.getTime()),
    endDate: formatDateInputFromTimestamp(end.getTime()),
    time: formatTimeInputFromTimestamp(reminderAt.getTime()),
    note: "",
  };
}
