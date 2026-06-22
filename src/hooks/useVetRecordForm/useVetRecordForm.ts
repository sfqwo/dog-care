import { useCallback, useMemo, useState } from "react";
import { createUid, formatDateInput, formatTimeInput } from "@dog-care/core/utils";
import type { UseVetRecordFormOptions } from "./types";
import { useInformer } from "@/src/components/informer";

export function useVetRecordForm({ selectedPetId, onSubmit }: UseVetRecordFormOptions) {
  const { showSuccess } = useInformer();
  const [title, setTitle] = useState("");
  const [clinic, setClinic] = useState("");
  const [date, setDate] = useState(formatDateInput(''));
  const [time, setTime] = useState(formatTimeInput(''));
  const [note, setNote] = useState("");

  const canSubmit = useMemo(
    () => Boolean(selectedPetId) && title.trim().length > 0 && date && time,
    [date, selectedPetId, time, title]
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
      date,
      time,
    };
    onSubmit(newRecord);
    showSuccess("Визит добавлен");
    setTitle("");
    setClinic("");
    setDate(formatDateInput(''));
    setTime(formatTimeInput(''));
    setNote("");
  }, [canSubmit, clinic, date, note, onSubmit, selectedPetId, showSuccess, time, title]);

  return {
    title,
    setTitle,
    clinic,
    setClinic,
    note,
    setNote,
    date,
    setDate,
    time,
    setTime,
    canSubmit,
    handleSubmit,
  };
}
