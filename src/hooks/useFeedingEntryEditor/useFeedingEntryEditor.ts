import { useMemo, useState } from "react";
import { createUid, isPositiveNumber } from "@dog-care/core/utils";
import type { Feeding } from "@dog-care/domain";
import { useEntryDateTime } from "../useEntryDateTime";
import { useInformer } from "@/src/components/informer";

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
  const { showSuccess } = useInformer();
  const [grams, setGrams] = useState("");
  const [food, setFood] = useState("");
  const [editingFeeding, setEditingFeeding] = useState<Feeding | null>(null);
  const [editGrams, setEditGrams] = useState("");
  const [editFood, setEditFood] = useState("");
  const entryDateTime = useEntryDateTime();
  const editDateTime = useEntryDateTime();
  const canAddFeeding = useMemo(
    () => Boolean(selectedPetId) &&
      isPositiveNumber(grams) &&
      Boolean(entryDateTime.timestamp && entryDateTime.timestamp <= Date.now()),
    [entryDateTime.timestamp, grams, selectedPetId]
  );
  const canSaveEditedFeeding = useMemo(
    () => Boolean(editingFeeding) &&
      isPositiveNumber(editGrams) &&
      Boolean(editDateTime.timestamp && editDateTime.timestamp <= Date.now()),
    [editDateTime.timestamp, editGrams, editingFeeding]
  );

  const resetForm = () => {
    setGrams("");
    setFood("");
    entryDateTime.resetToNow();
  };

  const closeEditFeedingModal = () => {
    setEditingFeeding(null);
    setEditGrams("");
    setEditFood("");
    editDateTime.resetToNow();
  };

  const handleSubmitFeeding = () => {
    if (!canAddFeeding || !selectedPetId || !entryDateTime.timestamp) return;
    const newItem: Feeding = {
      id: createUid(),
      at: entryDateTime.timestamp,
      petId: selectedPetId,
      grams: Number(grams),
      food: food.trim() || undefined,
    };
    addFeeding(selectedPetId, newItem);
    showSuccess("Кормление добавлено");
    resetForm();
  };

  const handleRemoveFeeding = (id: string) => {
    if (!selectedPetId) return;
    removeFeeding(selectedPetId, id);
    showSuccess("Кормление удалено");
    if (editingFeeding?.id === id) {
      closeEditFeedingModal();
    }
  };

  const handleEditFeeding = (feeding: Feeding) => {
    setEditingFeeding(feeding);
    setEditGrams(feeding.grams.toString());
    setEditFood(feeding.food ?? "");
    editDateTime.setTimestamp(feeding.at);
  };

  const handleSaveEditedFeeding = () => {
    if (
      !canSaveEditedFeeding ||
      !selectedPetId ||
      !editingFeeding ||
      !editDateTime.timestamp
    ) return;
    updateFeeding(selectedPetId, {
      ...editingFeeding,
      at: editDateTime.timestamp,
      grams: Number(editGrams),
      food: editFood.trim() || undefined,
    });
    showSuccess("Кормление обновлено");
    closeEditFeedingModal();
  };

  return {
    grams,
    setGrams,
    food,
    setFood,
    date: entryDateTime.date,
    setDate: entryDateTime.setDate,
    time: entryDateTime.time,
    setTime: entryDateTime.setTime,
    editingFeeding,
    editGrams,
    setEditGrams,
    editFood,
    setEditFood,
    editDate: editDateTime.date,
    setEditDate: editDateTime.setDate,
    editTime: editDateTime.time,
    setEditTime: editDateTime.setTime,
    canAddFeeding,
    canSaveEditedFeeding,
    handleSubmitFeeding,
    handleRemoveFeeding,
    handleEditFeeding,
    handleSaveEditedFeeding,
    closeEditFeedingModal,
  };
}
