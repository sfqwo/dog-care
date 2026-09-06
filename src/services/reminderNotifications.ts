import type { Reminder } from "@dog-care/domain";
import { getReminderCategoryLabel } from "@dog-care/core/shared";
import { canUseExpoNotifications } from "@/src/shared/runtime/expoEnvironment";

const REMINDER_CHANNEL_ID = "dog-care-reminders";

type ScheduleReminderNotificationParams = {
  reminder: Reminder;
  categoryLabel: string;
  requestPermission?: boolean;
};

export async function ensureReminderNotificationPermissions() {
  if (!canUseExpoNotifications()) return false;

  const Notifications = await import("expo-notifications");
  const current = await Notifications.getPermissionsAsync();
  const finalStatus = current.granted
    ? current
    : await Notifications.requestPermissionsAsync();

  return finalStatus.granted;
}

export async function scheduleReminderNotification({
  reminder,
  categoryLabel,
  requestPermission = true,
}: ScheduleReminderNotificationParams) {
  if (!canUseExpoNotifications() || reminder.completedAt || reminder.dueAt <= Date.now()) {
    return undefined;
  }

  const Notifications = await import("expo-notifications");
  const canNotify = requestPermission
    ? await ensureReminderNotificationPermissions()
    : (await Notifications.getPermissionsAsync()).granted;
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
  if (!notificationId || !canUseExpoNotifications()) return;
  const Notifications = await import("expo-notifications");
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

async function configureReminderNotificationChannel() {
  const { Platform } = await import("react-native");
  if (Platform.OS !== "android") return;

  const Notifications = await import("expo-notifications");
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
