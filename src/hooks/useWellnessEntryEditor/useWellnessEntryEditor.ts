import { useMemo, useState } from "react";
import {
  createUid,
  formatDateInputFromTimestamp,
  formatTimeInputFromTimestamp,
  parseDateTimeInput,
} from "@dog-care/core/utils";
import { useInformer } from "@/src/components/informer";
import type { WellnessEntry } from "@dog-care/domain";
import type { UseWellnessEntryEditorOptions, WellnessEntryForm } from "./types";
import {
  buildWellnessEntry,
  createInitialWellnessForm,
  isWellnessTemperatureValid,
} from "./utils";

export function useWellnessEntryEditor({
  selectedPetId,
  addEntry,
  updateEntry,
  removeEntry,
}: UseWellnessEntryEditorOptions) {
  const { showSuccess } = useInformer();
  const [form, setForm] = useState<WellnessEntryForm>(createInitialWellnessForm);
  const [editingEntry, setEditingEntry] = useState<WellnessEntry | null>(null);
  const [editForm, setEditForm] = useState<WellnessEntryForm>(createInitialWellnessForm);
  const at = useMemo(() => parseDateTimeInput(form.date, form.time), [form.date, form.time]);
  const editAt = useMemo(
    () => parseDateTimeInput(editForm.date, editForm.time),
    [editForm.date, editForm.time]
  );
  const canSubmit = Boolean(
    selectedPetId && at && at <= Date.now() && isWellnessTemperatureValid(form.temperature)
  );
  const canSaveEdit = Boolean(
    editingEntry &&
    editAt &&
    editAt <= Date.now() &&
    isWellnessTemperatureValid(editForm.temperature)
  );

  const updateForm = <K extends keyof WellnessEntryForm>(field: K, value: WellnessEntryForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateEditForm = <K extends keyof WellnessEntryForm>(
    field: K,
    value: WellnessEntryForm[K]
  ) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = () => {
    if (!selectedPetId || !at || !canSubmit) return;
    addEntry(selectedPetId, buildWellnessEntry(createUid(), selectedPetId, at, form));
    showSuccess("Самочувствие записано");
    setForm(createInitialWellnessForm());
  };

  const handleEdit = (entry: WellnessEntry) => {
    setEditingEntry(entry);
    setEditForm({
      date: formatDateInputFromTimestamp(entry.at),
      time: formatTimeInputFromTimestamp(entry.at),
      appetite: entry.appetite,
      activity: entry.activity,
      stool: entry.stool,
      vomiting: entry.vomiting,
      itching: entry.itching,
      temperature: entry.temperature?.toString() ?? "",
      note: entry.note ?? "",
    });
  };

  const closeEditModal = () => {
    setEditingEntry(null);
    setEditForm(createInitialWellnessForm());
  };

  const handleSaveEdit = () => {
    if (!selectedPetId || !editingEntry || !editAt || !canSaveEdit) return;
    updateEntry(
      selectedPetId,
      buildWellnessEntry(editingEntry.id, selectedPetId, editAt, editForm)
    );
    showSuccess("Запись самочувствия обновлена");
    closeEditModal();
  };

  const handleRemove = (id: string) => {
    if (!selectedPetId) return;
    removeEntry(selectedPetId, id);
    showSuccess("Запись самочувствия удалена");
    if (editingEntry?.id === id) closeEditModal();
  };

  return {
    form,
    editForm,
    editingEntry,
    canSubmit,
    canSaveEdit,
    updateForm,
    updateEditForm,
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleRemove,
    closeEditModal,
  };
}
