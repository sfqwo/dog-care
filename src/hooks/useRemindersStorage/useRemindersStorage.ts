import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import type { CompletedCareTask, Reminder } from "@dog-care/domain";
import {
  completeReminderInList,
  removeReminderFromList,
} from "@/src/services/reminderActions";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";

type RemindersByPet = Record<string, Reminder[]>;

type CompleteReminderOptions = {
  onCompletedTask?: (petId: string, task: CompletedCareTask) => void;
};

export function useRemindersStorage(selectedPetId?: string | null) {
  const [remindersByPet, setRemindersByPet] = useState<RemindersByPet>({});
  const [storageLoaded, setStorageLoaded] = useState(false);
  const reminders = useMemo(
    () => (selectedPetId ? remindersByPet[selectedPetId] ?? [] : []),
    [remindersByPet, selectedPetId]
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      loadJSON<RemindersByPet>(STORAGE_KEYS.REMINDERS, {}).then((storedReminders) => {
        if (!isActive) return;
        setRemindersByPet(storedReminders ?? {});
        setStorageLoaded(true);
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.REMINDERS, remindersByPet);
  }, [remindersByPet, storageLoaded]);

  const addReminder = useCallback(
    (reminder: Reminder) => {
      if (!selectedPetId) return;
      setRemindersByPet((prev) => {
        const current = prev[selectedPetId] ?? [];
        return { ...prev, [selectedPetId]: [reminder, ...current] };
      });
    },
    [selectedPetId]
  );

  const removeReminder = useCallback(
    async (id: string) => {
      if (!selectedPetId) return;
      const nextList = await removeReminderFromList(reminders, id);
      setRemindersByPet((prev) => {
        if (nextList === reminders) return prev;
        return { ...prev, [selectedPetId]: nextList };
      });
    },
    [reminders, selectedPetId]
  );

  const completeReminder = useCallback(
    async (id: string, options: CompleteReminderOptions = {}) => {
      if (!selectedPetId) return;
      const nextList = await completeReminderInList(reminders, id, options);
      setRemindersByPet((prev) => {
        if (nextList === reminders) return prev;
        return { ...prev, [selectedPetId]: nextList };
      });
    },
    [reminders, selectedPetId]
  );

  return {
    reminders,
    addReminder,
    removeReminder,
    completeReminder,
  };
}
