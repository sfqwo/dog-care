import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import type { Reminder } from "@dog-care/types";
import { getReminderRoute } from "@dog-care/core/shared";
import { completeReminderInList } from "@/src/services/reminderActions";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";

type RemindersByPet = Record<string, Reminder[]>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.addNotificationResponseReceivedListener(async (response) => {
  const data = response.notification.request.content.data;
  await handleReminderNotificationPress(data?.reminderId, data?.petId);
  const category = data?.category;
  router.push(getReminderRoute(category));
});

async function handleReminderNotificationPress(reminderId: unknown, petId: unknown) {
  if (typeof reminderId !== "string") return;

  const stored = await loadJSON<RemindersByPet>(STORAGE_KEYS.REMINDERS, {});
  if (typeof petId === "string" && stored[petId]) {
    const nextForPet = await resolveReminderPress(stored[petId], reminderId);
    await saveJSON(STORAGE_KEYS.REMINDERS, { ...stored, [petId]: nextForPet });
    return;
  }

  const nextEntries = await Promise.all(
    Object.entries(stored).map(async ([currentPetId, reminders]) => [
      currentPetId,
      await resolveReminderPress(reminders, reminderId),
    ] as const)
  );
  const next = Object.fromEntries(nextEntries);
  await saveJSON(STORAGE_KEYS.REMINDERS, next);
}

async function resolveReminderPress(reminders: Reminder[], reminderId: string) {
  return completeReminderInList(reminders, reminderId);
}
