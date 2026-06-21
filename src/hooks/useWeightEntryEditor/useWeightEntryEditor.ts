import { useMemo, useState } from "react";
import {
  createUid,
  formatCurrentDateInput,
  formatDateInputFromTimestamp,
  isPositiveNumber,
  normalizeDecimalInput,
  parseDateInputTimestamp,
} from "@dog-care/core/utils";
import type { WeightEntry } from "@dog-care/domain";

type UseWeightEntryEditorOptions = {
  selectedPetId?: string | null;
  addWeightEntry: (petId: string, entry: WeightEntry) => void;
  updateWeightEntry: (petId: string, entry: WeightEntry) => void;
  removeWeightEntry: (petId: string, id: string) => void;
};

export function useWeightEntryEditor({
  selectedPetId,
  addWeightEntry,
  updateWeightEntry,
  removeWeightEntry,
}: UseWeightEntryEditorOptions) {
  const [date, setDate] = useState(formatCurrentDateInput);
  const [weight, setWeight] = useState("");
  const [note, setNote] = useState("");
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [editDate, setEditDate] = useState(formatCurrentDateInput);
  const [editWeight, setEditWeight] = useState("");
  const [editNote, setEditNote] = useState("");

  const parsedDate = useMemo(() => parseDateInputTimestamp(date), [date]);
  const parsedEditDate = useMemo(() => parseDateInputTimestamp(editDate), [editDate]);
  const canAddWeightEntry = useMemo(
    () => Boolean(selectedPetId) && Boolean(parsedDate) && isPositiveNumber(normalizeDecimalInput(weight)),
    [parsedDate, selectedPetId, weight]
  );
  const canSaveEditedWeightEntry = useMemo(
    () => Boolean(editingEntry) && Boolean(parsedEditDate) && isPositiveNumber(normalizeDecimalInput(editWeight)),
    [editWeight, editingEntry, parsedEditDate]
  );

  const resetForm = () => {
    setDate(formatCurrentDateInput());
    setWeight("");
    setNote("");
  };

  const closeEditWeightModal = () => {
    setEditingEntry(null);
    setEditDate(formatCurrentDateInput());
    setEditWeight("");
    setEditNote("");
  };

  const handleSubmitWeightEntry = () => {
    if (!canAddWeightEntry || !selectedPetId || !parsedDate) return;
    const newEntry: WeightEntry = {
      id: createUid(),
      petId: selectedPetId,
      at: parsedDate,
      weight: Number(normalizeDecimalInput(weight)),
      note: note.trim() || undefined,
    };
    addWeightEntry(selectedPetId, newEntry);
    resetForm();
  };

  const handleRemoveWeightEntry = (id: string) => {
    if (!selectedPetId) return;
    removeWeightEntry(selectedPetId, id);
    if (editingEntry?.id === id) {
      closeEditWeightModal();
    }
  };

  const handleEditWeightEntry = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setEditDate(formatDateInputFromTimestamp(entry.at));
    setEditWeight(entry.weight.toString());
    setEditNote(entry.note ?? "");
  };

  const handleSaveEditedWeightEntry = () => {
    if (!canSaveEditedWeightEntry || !selectedPetId || !editingEntry || !parsedEditDate) return;
    updateWeightEntry(selectedPetId, {
      ...editingEntry,
      at: parsedEditDate,
      weight: Number(normalizeDecimalInput(editWeight)),
      note: editNote.trim() || undefined,
    });
    closeEditWeightModal();
  };

  return {
    date,
    setDate,
    weight,
    setWeight,
    note,
    setNote,
    editingEntry,
    editDate,
    setEditDate,
    editWeight,
    setEditWeight,
    editNote,
    setEditNote,
    canAddWeightEntry,
    canSaveEditedWeightEntry,
    handleSubmitWeightEntry,
    handleRemoveWeightEntry,
    handleEditWeightEntry,
    handleSaveEditedWeightEntry,
    closeEditWeightModal,
  };
}
