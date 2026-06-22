import { useMemo, useState } from "react";
import { createUid, isPositiveNumber } from "@dog-care/core/utils";
import type { Walk } from "@dog-care/domain";
import { useEntryDateTime } from "../useEntryDateTime";
import { useInformer } from "@/src/components/informer";

export function useWalkEntryEditor({
  selectedPetId,
  addWalk,
  updateWalk,
  removeWalk,
}: {
  selectedPetId?: string | null;
  addWalk: (petId: string, walk: Walk) => void;
  updateWalk: (petId: string, walk: Walk) => void;
  removeWalk: (petId: string, id: string) => void;
}) {
  const { showSuccess } = useInformer();
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");
  const [editingWalk, setEditingWalk] = useState<Walk | null>(null);
  const [editDurationMin, setEditDurationMin] = useState("");
  const [editNote, setEditNote] = useState("");
  const entryDateTime = useEntryDateTime();
  const editDateTime = useEntryDateTime();
  const canAddWalk = useMemo(
    () => Boolean(selectedPetId) &&
      isPositiveNumber(durationMin) &&
      Boolean(entryDateTime.timestamp && entryDateTime.timestamp <= Date.now()),
    [durationMin, entryDateTime.timestamp, selectedPetId]
  );
  const canSaveEditedWalk = useMemo(
    () => Boolean(editingWalk) &&
      isPositiveNumber(editDurationMin) &&
      Boolean(editDateTime.timestamp && editDateTime.timestamp <= Date.now()),
    [editDateTime.timestamp, editDurationMin, editingWalk]
  );

  const closeEditWalkModal = () => {
    setEditingWalk(null);
    setEditDurationMin("");
    setEditNote("");
    editDateTime.resetToNow();
  };

  const handleAddWalk = () => {
    if (!canAddWalk || !selectedPetId || !entryDateTime.timestamp) return;
    const newItem: Walk = {
      id: createUid(),
      startedAt: entryDateTime.timestamp,
      petId: selectedPetId,
      durationMin: Number(durationMin),
      note: note.trim() || undefined,
    };
    addWalk(selectedPetId, newItem);
    showSuccess("Прогулка добавлена");
    setDurationMin("");
    setNote("");
    entryDateTime.resetToNow();
  };

  const handleRemoveWalk = (id: string) => {
    if (!selectedPetId) return;
    removeWalk(selectedPetId, id);
    showSuccess("Прогулка удалена");
    if (editingWalk?.id === id) {
      closeEditWalkModal();
    }
  };

  const handleEditWalk = (walk: Walk) => {
    setEditingWalk(walk);
    setEditDurationMin(walk.durationMin.toString());
    setEditNote(walk.note ?? "");
    editDateTime.setTimestamp(walk.startedAt);
  };

  const handleSaveEditedWalk = () => {
    if (
      !canSaveEditedWalk ||
      !selectedPetId ||
      !editingWalk ||
      !editDateTime.timestamp
    ) return;
    updateWalk(selectedPetId, {
      ...editingWalk,
      startedAt: editDateTime.timestamp,
      durationMin: Number(editDurationMin),
      note: editNote.trim() || undefined,
    });
    showSuccess("Прогулка обновлена");
    closeEditWalkModal();
  };

  return {
    durationMin,
    setDurationMin,
    note,
    setNote,
    date: entryDateTime.date,
    setDate: entryDateTime.setDate,
    time: entryDateTime.time,
    setTime: entryDateTime.setTime,
    editingWalk,
    editDurationMin,
    setEditDurationMin,
    editNote,
    setEditNote,
    editDate: editDateTime.date,
    setEditDate: editDateTime.setDate,
    editTime: editDateTime.time,
    setEditTime: editDateTime.setTime,
    canAddWalk,
    canSaveEditedWalk,
    handleAddWalk,
    handleRemoveWalk,
    handleEditWalk,
    handleSaveEditedWalk,
    closeEditWalkModal,
  };
}
