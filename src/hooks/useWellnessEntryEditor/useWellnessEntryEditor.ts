import { useMemo, useState } from "react";
import type {
  ActivityStatus,
  AppetiteStatus,
  StoolStatus,
  WellnessEntry,
} from "@dog-care/domain";
import {
  createUid,
  formatCurrentDateInput,
  formatDateInputFromTimestamp,
  formatTimeInputFromTimestamp,
  normalizeDecimalInput,
  parseDateTimeInput,
} from "@dog-care/core/utils";

export type WellnessEntryForm = {
  date: string;
  time: string;
  appetite: AppetiteStatus;
  activity: ActivityStatus;
  stool: StoolStatus;
  vomiting: boolean;
  itching: boolean;
  temperature: string;
  note: string;
};

const createInitialForm = (): WellnessEntryForm => ({
  date: formatCurrentDateInput(),
  time: formatTimeInputFromTimestamp(Date.now()),
  appetite: "normal",
  activity: "normal",
  stool: "normal",
  vomiting: false,
  itching: false,
  temperature: "",
  note: "",
});

type UseWellnessEntryEditorOptions = {
  selectedPetId?: string | null;
  addEntry: (petId: string, entry: WellnessEntry) => void;
  updateEntry: (petId: string, entry: WellnessEntry) => void;
  removeEntry: (petId: string, id: string) => void;
};

export function useWellnessEntryEditor({
  selectedPetId,
  addEntry,
  updateEntry,
  removeEntry,
}: UseWellnessEntryEditorOptions) {
  const [form, setForm] = useState<WellnessEntryForm>(createInitialForm);
  const [editingEntry, setEditingEntry] = useState<WellnessEntry | null>(null);
  const [editForm, setEditForm] = useState<WellnessEntryForm>(createInitialForm);
  const at = useMemo(() => parseDateTimeInput(form.date, form.time), [form.date, form.time]);
  const editAt = useMemo(
    () => parseDateTimeInput(editForm.date, editForm.time),
    [editForm.date, editForm.time]
  );
  const canSubmit = Boolean(selectedPetId && at && at <= Date.now() && isTemperatureValid(form.temperature));
  const canSaveEdit = Boolean(
    editingEntry && editAt && editAt <= Date.now() && isTemperatureValid(editForm.temperature)
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
    addEntry(selectedPetId, buildEntry(createUid(), selectedPetId, at, form));
    setForm(createInitialForm());
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
    setEditForm(createInitialForm());
  };

  const handleSaveEdit = () => {
    if (!selectedPetId || !editingEntry || !editAt || !canSaveEdit) return;
    updateEntry(
      selectedPetId,
      buildEntry(editingEntry.id, selectedPetId, editAt, editForm)
    );
    closeEditModal();
  };

  const handleRemove = (id: string) => {
    if (!selectedPetId) return;
    removeEntry(selectedPetId, id);
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

function buildEntry(
  id: string,
  petId: string,
  at: number,
  form: WellnessEntryForm
): WellnessEntry {
  const temperature = form.temperature
    ? Number(normalizeDecimalInput(form.temperature))
    : undefined;
  return {
    id,
    petId,
    at,
    appetite: form.appetite,
    activity: form.activity,
    stool: form.stool,
    vomiting: form.vomiting,
    itching: form.itching,
    temperature,
    note: form.note.trim() || undefined,
  };
}

function isTemperatureValid(value: string) {
  if (!value.trim()) return true;
  const temperature = Number(normalizeDecimalInput(value));
  return Number.isFinite(temperature) && temperature >= 30 && temperature <= 45;
}
