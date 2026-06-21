import { useMemo, useState } from "react";
import {
  parseMedicationCourseSchedule,
} from "@dog-care/domain";
import type { MedicationCourse, Reminder } from "@dog-care/domain";
import {
  createUid,
  formatDateInputFromTimestamp,
  formatTimeInputFromTimestamp,
} from "@dog-care/core/utils";
import { scheduleReminderNotification } from "@/src/services/reminderNotifications";

export type MedicationCourseForm = {
  name: string;
  dosage: string;
  startDate: string;
  endDate: string;
  time: string;
  note: string;
};

const createInitialForm = (): MedicationCourseForm => {
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
};

type UseMedicationCourseEditorOptions = {
  selectedPetId?: string | null;
  addCourse: (petId: string, course: MedicationCourse) => void;
  updateCourse: (petId: string, course: MedicationCourse) => void;
  removeCourse: (petId: string, id: string) => void;
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => Promise<void>;
};

export function useMedicationCourseEditor({
  selectedPetId,
  addCourse,
  updateCourse,
  removeCourse,
  addReminder,
  removeReminder,
}: UseMedicationCourseEditorOptions) {
  const [form, setForm] = useState<MedicationCourseForm>(createInitialForm);
  const [editingCourse, setEditingCourse] = useState<MedicationCourse | null>(null);
  const [editForm, setEditForm] = useState<MedicationCourseForm>(createInitialForm);
  const [isSaving, setIsSaving] = useState(false);
  const schedule = useMemo(
    () => parseMedicationCourseSchedule(form.startDate, form.endDate, form.time),
    [form.endDate, form.startDate, form.time]
  );
  const editSchedule = useMemo(
    () => parseMedicationCourseSchedule(editForm.startDate, editForm.endDate, editForm.time),
    [editForm.endDate, editForm.startDate, editForm.time]
  );
  const canSubmit = Boolean(
    selectedPetId && form.name.trim() && form.dosage.trim() && schedule?.nextDoseAt && !isSaving
  );
  const canSaveEdit = Boolean(
    editingCourse && editForm.name.trim() && editForm.dosage.trim() && editSchedule?.nextDoseAt && !isSaving
  );

  const updateForm = (field: keyof MedicationCourseForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditForm = (field: keyof MedicationCourseForm, value: string) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedPetId || !schedule?.nextDoseAt || !canSubmit) return;
    setIsSaving(true);
    try {
      const reminderId = `medication:${createUid()}`;
      const course: MedicationCourse = {
        id: createUid(),
        petId: selectedPetId,
        name: form.name.trim(),
        dosage: form.dosage.trim(),
        startAt: schedule.startAt,
        endAt: schedule.endAt,
        time: form.time,
        note: form.note.trim() || undefined,
        reminderId,
        createdAt: Date.now(),
      };
      const reminder = await createMedicationReminder(course, schedule.nextDoseAt);
      addCourse(selectedPetId, course);
      addReminder(reminder);
      setForm(createInitialForm());
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (course: MedicationCourse) => {
    setEditingCourse(course);
    setEditForm({
      name: course.name,
      dosage: course.dosage,
      startDate: formatDateInputFromTimestamp(course.startAt),
      endDate: formatDateInputFromTimestamp(course.endAt),
      time: course.time,
      note: course.note ?? "",
    });
  };

  const closeEditModal = () => {
    setEditingCourse(null);
    setEditForm(createInitialForm());
  };

  const handleSaveEdit = async () => {
    if (!selectedPetId || !editingCourse || !editSchedule?.nextDoseAt || !canSaveEdit) return;
    setIsSaving(true);
    try {
      await removeReminder(editingCourse.reminderId);
      const course: MedicationCourse = {
        ...editingCourse,
        name: editForm.name.trim(),
        dosage: editForm.dosage.trim(),
        startAt: editSchedule.startAt,
        endAt: editSchedule.endAt,
        time: editForm.time,
        note: editForm.note.trim() || undefined,
      };
      const reminder = await createMedicationReminder(course, editSchedule.nextDoseAt);
      updateCourse(selectedPetId, course);
      addReminder(reminder);
      closeEditModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (course: MedicationCourse) => {
    if (!selectedPetId) return;
    await removeReminder(course.reminderId);
    removeCourse(selectedPetId, course.id);
    if (editingCourse?.id === course.id) closeEditModal();
  };

  return {
    form,
    editForm,
    editingCourse,
    canSubmit,
    canSaveEdit,
    isSaving,
    updateForm,
    updateEditForm,
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleRemove,
    closeEditModal,
  };
}

async function createMedicationReminder(course: MedicationCourse, dueAt: number) {
  const base: Reminder = {
    id: course.reminderId,
    petId: course.petId,
    title: `Принять ${course.name}`,
    dueAt,
    category: "treatment",
    repeat: "daily",
    repeatUntil: course.endAt,
    note: [course.dosage, course.note].filter(Boolean).join(" • "),
  };
  const notificationId = await scheduleReminderNotification({
    reminder: base,
    categoryLabel: course.dosage,
  });
  return { ...base, notificationId };
}
