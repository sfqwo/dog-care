import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import type { Reminder } from "@dog-care/types";
import { getReminderCategoryLabel } from "@/packages/core";

const REMINDER_CHANNEL_ID = "dog-care-reminders";

type ScheduleReminderNotificationParams = {
  reminder: Reminder;
  categoryLabel: string;
};

export async function ensureReminderNotificationPermissions() {
  if (Platform.OS === "web") return false;

  const current = await Notifications.getPermissionsAsync();
  const finalStatus = current.granted
    ? current
    : await Notifications.requestPermissionsAsync();

  return finalStatus.granted;
}

export async function scheduleReminderNotification({
  reminder,
  categoryLabel,
}: ScheduleReminderNotificationParams) {
  if (Platform.OS === "web" || reminder.completedAt || reminder.dueAt <= Date.now()) {
    return undefined;
  }

  const canNotify = await ensureReminderNotificationPermissions();
  if (!canNotify) return undefined;

  await configureReminderNotificationChannel();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `${getReminderCategoryLabel(reminder.category)} - ${reminder.title}`,
      body: buildReminderBody(reminder, categoryLabel),
      sound: true,
      data: {
        reminderId: reminder.id,
        petId: reminder.petId,
        category: reminder.category,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(reminder.dueAt),
      channelId: REMINDER_CHANNEL_ID,
    },
  });
}

export async function cancelReminderNotification(notificationId?: string) {
  if (!notificationId || Platform.OS === "web") return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

async function configureReminderNotificationChannel() {
  if (Platform.OS !== "android") return;

  await Notifications.setNotificationChannelAsync(REMINDER_CHANNEL_ID, {
    name: "Dog Care reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

function buildReminderBody(reminder: Reminder, categoryLabel: string) {
  const note = reminder.note?.trim();
  return note ? `${categoryLabel}: ${note}` : categoryLabel;
}
