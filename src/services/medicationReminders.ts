import type { MedicationCourse, Reminder } from "@dog-care/domain";
import { scheduleReminderNotification } from "./reminderNotifications";

export async function createMedicationReminder(course: MedicationCourse, dueAt: number) {
  const reminder: Reminder = {
    id: course.reminderId,
    petId: course.petId,
    title: `Принять ${course.name}`,
    dueAt,
    category: "treatment",
    repeat: "daily",
    repeatUntil: course.endAt,
    note: [course.dosage, course.note].filter(Boolean).join(" • "),
  };
  const notificationId = await scheduleReminderNotification({
    reminder,
    categoryLabel: course.dosage,
  });
  return { ...reminder, notificationId };
}
