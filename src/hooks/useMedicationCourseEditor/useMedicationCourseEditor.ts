import { useMemo, useState } from "react";
import {
  parseMedicationCourseSchedule,
} from "@dog-care/domain";
import type { MedicationCourse } from "@dog-care/domain";
import {
  createUid,
  formatDateInputFromTimestamp,
} from "@dog-care/core/utils";
import type { MedicationCourseForm, UseMedicationCourseEditorOptions } from "./types";
import { useInformer } from "@/src/components/informer";
import { createInitialMedicationCourseForm } from "./utils";
import { createMedicationReminder } from "@/src/services/medicationReminders";

export function useMedicationCourseEditor({
  selectedPetId,
  addCourse,
  updateCourse,
  removeCourse,
  addReminder,
  removeReminder,
}: UseMedicationCourseEditorOptions) {
  const { showSuccess } = useInformer();
  const [form, setForm] = useState<MedicationCourseForm>(createInitialMedicationCourseForm);
  const [editingCourse, setEditingCourse] = useState<MedicationCourse | null>(null);
  const [editForm, setEditForm] = useState<MedicationCourseForm>(createInitialMedicationCourseForm);
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
      showSuccess("Курс лечения добавлен");
      setForm(createInitialMedicationCourseForm());
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
    setEditForm(createInitialMedicationCourseForm());
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
      showSuccess("Курс лечения обновлён");
      closeEditModal();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async (course: MedicationCourse) => {
    if (!selectedPetId) return;
    await removeReminder(course.reminderId);
    removeCourse(selectedPetId, course.id);
    showSuccess("Курс лечения удалён");
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
