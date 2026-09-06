import { useEffect, useRef } from "react";
import {
  BIRTHDAY_REMINDER_PREFIX,
  buildPetBirthdayReminder,
  isBirthdayReminderCurrent,
} from "@dog-care/domain";
import { useCareRecordsContext } from "@/src/hooks/careRecordsContext";
import { useProfileContext } from "@/src/hooks/profileContext";
import { scheduleBirthdayNotification } from "@/src/services/birthdayReminders";

export function BirthdayReminderSync() {
  const { profile, isProfileLoaded } = useProfileContext();
  const { remindersByPet, addReminder, removeReminder, isCareRecordsLoaded } = useCareRecordsContext();
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!isProfileLoaded || !isCareRecordsLoaded || syncingRef.current) return;
    syncingRef.current = true;

    const sync = async () => {
      const petIds = new Set(profile.pets.map((pet) => pet.id));

      for (const pet of profile.pets) {
        const existing = (remindersByPet[pet.id] ?? []).find((reminder) =>
          reminder.id.startsWith(BIRTHDAY_REMINDER_PREFIX)
        );
        const desired = buildPetBirthdayReminder(pet);

        if (!desired) {
          if (existing) await removeReminder(pet.id, existing.id);
          continue;
        }

        if (existing && isBirthdayReminderCurrent(existing, pet)) {
          if (!existing.notificationId) {
            const notificationId = await scheduleBirthdayNotification(existing);
            if (notificationId) addReminder(pet.id, { ...existing, notificationId });
          }
          continue;
        }

        if (existing) await removeReminder(pet.id, existing.id);
        const notificationId = await scheduleBirthdayNotification(desired);
        addReminder(pet.id, { ...desired, notificationId });
      }

      for (const [petId, reminders] of Object.entries(remindersByPet)) {
        if (petIds.has(petId)) continue;
        for (const reminder of reminders) {
          if (reminder.id.startsWith(BIRTHDAY_REMINDER_PREFIX)) {
            await removeReminder(petId, reminder.id);
          }
        }
      }
    };

    void sync().finally(() => {
      syncingRef.current = false;
    });
  }, [addReminder, isCareRecordsLoaded, isProfileLoaded, profile.pets, remindersByPet, removeReminder]);

  return null;
}
