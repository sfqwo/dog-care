import { MedicationCourse, Reminder } from "@/packages/domain";

export type MedicationCourseForm = {
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
  time: string;
  note: string;
};

export type UseMedicationCourseEditorOptions = {
  selectedPetId?: string | null;
  addCourse: (petId: string, course: MedicationCourse) => void;
  updateCourse: (petId: string, course: MedicationCourse) => void;
  removeCourse: (petId: string, id: string) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => Promise<void>;
};