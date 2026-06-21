import { useMemo, useState } from "react";
import {
  formatDateInputFromTimestamp,
  formatTimeInputFromTimestamp,
  parseDateTimeInput,
} from "@dog-care/core/utils";
import type { ReminderCategory, ReminderRepeat } from "@dog-care/domain";

export function useReminderForm(selectedPetId?: string | null) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDateInputFromTimestamp(Date.now()));
  const [time, setTime] = useState(formatTimeInputFromTimestamp(Date.now()));
  const [category, setCategory] = useState<ReminderCategory>("feeding");
  const [repeat, setRepeat] = useState<ReminderRepeat>("none");
  const [note, setNote] = useState("");
  const dueAt = useMemo(() => parseDateTimeInput(date, time), [date, time]);
  const canAddReminder = Boolean(selectedPetId && title.trim() && dueAt);

  const resetReminderForm = () => {
    setTitle("");
    setNote("");
  };

  return {
    title,
    setTitle,
    date,
    setDate,
    time,
    setTime,
    category,
    setCategory,
    repeat,
    setRepeat,
    note,
    setNote,
    dueAt,
    canAddReminder,
    resetReminderForm,
  };
}
