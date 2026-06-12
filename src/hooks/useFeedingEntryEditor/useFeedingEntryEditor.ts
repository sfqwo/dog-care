import { useMemo, useState } from "react";
import { createUid, isPositiveNumber } from "@dog-care/core/utils";
import type { Feeding } from "@dog-care/domain";

export function useFeedingEntryEditor({
  selectedPetId,
  addFeeding,
  updateFeeding,
  removeFeeding,
}: {
  selectedPetId?: string | null;
  addFeeding: (petId: string, feeding: Feeding) => void;
  updateFeeding: (petId: string, feeding: Feeding) => void;
  removeFeeding: (petId: string, id: string) => void;
}) {
  const [grams, setGrams] = useState("");
  const [food, setFood] = useState("");
  const [editingFeeding, setEditingFeeding] = useState<Feeding | null>(null);
  const [editGrams, setEditGrams] = useState("");
  const [editFood, setEditFood] = useState("");
  const canAddFeeding = useMemo(
    () => Boolean(selectedPetId) && isPositiveNumber(grams),
    [selectedPetId, grams]
  );
  const canSaveEditedFeeding = useMemo(
    () => Boolean(editingFeeding) && isPositiveNumber(editGrams),
    [editingFeeding, editGrams]
  );

  const resetForm = () => {
    setGrams("");
    setFood("");
  };

  const closeEditFeedingModal = () => {
    setEditingFeeding(null);
    setEditGrams("");
    setEditFood("");
  };

  const handleSubmitFeeding = () => {
    if (!canAddFeeding || !selectedPetId) return;
    const newItem: Feeding = {
      id: createUid(),
      at: Date.now(),
      petId: selectedPetId,
      grams: Number(grams),
      food: food.trim() || undefined,
    };
    addFeeding(selectedPetId, newItem);
    resetForm();
  };

  const handleRemoveFeeding = (id: string) => {
    if (!selectedPetId) return;
    removeFeeding(selectedPetId, id);
    if (editingFeeding?.id === id) {
      closeEditFeedingModal();
    }
  };

  const handleEditFeeding = (feeding: Feeding) => {
    setEditingFeeding(feeding);
    setEditGrams(feeding.grams.toString());
    setEditFood(feeding.food ?? "");
  };

  const handleSaveEditedFeeding = () => {
    if (!canSaveEditedFeeding || !selectedPetId || !editingFeeding) return;
    updateFeeding(selectedPetId, {
      ...editingFeeding,
      grams: Number(editGrams),
      food: editFood.trim() || undefined,
    });
    closeEditFeedingModal();
  };

  return {
    grams,
    setGrams,
    food,
    setFood,
    editingFeeding,
    editGrams,
    setEditGrams,
    editFood,
    setEditFood,
    canAddFeeding,
    canSaveEditedFeeding,
    handleSubmitFeeding,
    handleRemoveFeeding,
    handleEditFeeding,
    handleSaveEditedFeeding,
    closeEditFeedingModal,
  };
}
