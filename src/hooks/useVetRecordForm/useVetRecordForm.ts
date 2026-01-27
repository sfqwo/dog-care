import { createUid } from "@/packages/core";
import { useCallback, useMemo, useState } from "react";
import type { UseVetRecordFormOptions } from "./types";

export function useVetRecordForm({ selectedPetId, onSubmit }: UseVetRecordFormOptions) {
  const [title, setTitle] = useState("");
  const [clinic, setClinic] = useState("");
  const [note, setNote] = useState("");

  const canSubmit = useMemo(
    () => Boolean(selectedPetId) && title.trim().length > 0,
    [selectedPetId, title]
  );

  const handleSubmit = useCallback(() => {
    if (!canSubmit || !selectedPetId) return;
    const newRecord = {
      id: createUid(),
      at: Date.now(),
      petId: selectedPetId,
      title: title.trim(),
      clinic: clinic.trim() || undefined,
      note: note.trim() || undefined,
    };
    onSubmit(newRecord);
    setTitle("");
    setClinic("");
    setNote("");
  }, [canSubmit, clinic, note, onSubmit, selectedPetId, title]);

  return {
    title,
    setTitle,
    clinic,
    setClinic,
    note,
    setNote,
    canSubmit,
    handleSubmit,
  };
}