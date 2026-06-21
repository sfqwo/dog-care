import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import type { CompletedCareTask, Reminder } from "@dog-care/domain";
import { useCareRecordsContext } from "@/src/hooks/careRecordsContext";

type CompleteReminderOptions = {
  onCompletedTask?: (petId: string, task: CompletedCareTask) => void;
};

export function useRemindersStorage(selectedPetId?: string | null) {
  const {
    getReminders,
    addReminder: addReminderToContext,
    removeReminder: removeReminderFromContext,
    completeReminder: completeReminderInContext,
    reloadReminders,
    reloadCompletedTasks,
  } = useCareRecordsContext();
  const reminders = getReminders(selectedPetId);

  useFocusEffect(
    useCallback(() => {
      void Promise.all([reloadReminders(), reloadCompletedTasks()]);
    }, [reloadCompletedTasks, reloadReminders])
  );

  const addReminder = useCallback(
    (reminder: Reminder) => {
      if (!selectedPetId) return;
      addReminderToContext(selectedPetId, reminder);
    },
    [addReminderToContext, selectedPetId]
  );

  const removeReminder = useCallback(
    async (id: string) => {
      if (!selectedPetId) return;
      await removeReminderFromContext(selectedPetId, id);
    },
    [removeReminderFromContext, selectedPetId]
  );

  const completeReminder = useCallback(
    async (id: string, options: CompleteReminderOptions = {}) => {
      if (!selectedPetId) return;
      await completeReminderInContext(selectedPetId, id, options);
    },
    [completeReminderInContext, selectedPetId]
  );

  return {
    reminders,
    addReminder,
    removeReminder,
    completeReminder,
  };
}
