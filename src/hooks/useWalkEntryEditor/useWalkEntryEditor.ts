import { useMemo, useState } from "react";
import { createUid, isPositiveNumber } from "@dog-care/core/utils";
import type { Walk } from "@dog-care/domain";

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
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");
  const [editingWalk, setEditingWalk] = useState<Walk | null>(null);
  const [editDurationMin, setEditDurationMin] = useState("");
  const [editNote, setEditNote] = useState("");
  const canAddWalk = useMemo(
    () => Boolean(selectedPetId) && isPositiveNumber(durationMin),
    [selectedPetId, durationMin]
  );
  const canSaveEditedWalk = useMemo(
    () => Boolean(editingWalk) && isPositiveNumber(editDurationMin),
    [editingWalk, editDurationMin]
  );

  const closeEditWalkModal = () => {
    setEditingWalk(null);
    setEditDurationMin("");
    setEditNote("");
  };

  const handleAddWalk = () => {
    if (!canAddWalk || !selectedPetId) return;
    const newItem: Walk = {
      id: createUid(),
      startedAt: Date.now(),
      petId: selectedPetId,
      durationMin: Number(durationMin),
      note: note.trim() || undefined,
    };
    addWalk(selectedPetId, newItem);
    setDurationMin("");
    setNote("");
  };

  const handleRemoveWalk = (id: string) => {
    if (!selectedPetId) return;
    removeWalk(selectedPetId, id);
    if (editingWalk?.id === id) {
      closeEditWalkModal();
    }
  };

  const handleEditWalk = (walk: Walk) => {
    setEditingWalk(walk);
    setEditDurationMin(walk.durationMin.toString());
    setEditNote(walk.note ?? "");
  };

  const handleSaveEditedWalk = () => {
    if (!canSaveEditedWalk || !selectedPetId || !editingWalk) return;
    updateWalk(selectedPetId, {
      ...editingWalk,
      durationMin: Number(editDurationMin),
      note: editNote.trim() || undefined,
    });
    closeEditWalkModal();
  };

  return {
    durationMin,
    setDurationMin,
    note,
    setNote,
    editingWalk,
    editDurationMin,
    setEditDurationMin,
    editNote,
    setEditNote,
    canAddWalk,
    canSaveEditedWalk,
    handleAddWalk,
    handleRemoveWalk,
    handleEditWalk,
    handleSaveEditedWalk,
    closeEditWalkModal,
  };
}
