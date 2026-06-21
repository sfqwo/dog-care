import { createClampedLocalDate, isSameLocalDay, parseDate } from "@dog-care/core/utils";
import type { Pet, Reminder } from "./domain";

export const BIRTHDAY_REMINDER_PREFIX = "birthday:";

export function getBirthdayReminderId(petId: string) {
  return `${BIRTHDAY_REMINDER_PREFIX}${petId}`;
}

export function buildPetBirthdayReminder(pet: Pet, now = Date.now()): Reminder | null {
  const birthdate = pet.birthdate ? parseDate(pet.birthdate) : null;
  if (!birthdate) return null;

  const dueAt = getNextBirthdayDueAt(birthdate, now);
  return {
    id: getBirthdayReminderId(pet.id),
    petId: pet.id,
    title: `День рождения: ${pet.name}`,
    dueAt,
    category: "birthday",
    repeat: "yearly",
    yearlyMonth: birthdate.getMonth() + 1,
    yearlyDay: birthdate.getDate(),
    note: "Поздравьте питомца и устройте ему особенный день.",
  };
}

export function isBirthdayReminderCurrent(reminder: Reminder, pet: Pet) {
  const birthdate = pet.birthdate ? parseDate(pet.birthdate) : null;
  if (!birthdate) return false;
  const expectedDate = createBirthdayOccurrence(
    reminderDueYear(reminder),
    birthdate.getMonth(),
    birthdate.getDate()
  );

  return (
    reminder.id === getBirthdayReminderId(pet.id) &&
    reminder.title === `День рождения: ${pet.name}` &&
    reminder.category === "birthday" &&
    reminder.repeat === "yearly" &&
    reminder.yearlyMonth === birthdate.getMonth() + 1 &&
    reminder.yearlyDay === birthdate.getDate() &&
    isSameLocalDay(reminder.dueAt, expectedDate.getTime())
  );
}

function getNextBirthdayDueAt(birthdate: Date, now: number) {
  const current = new Date(now);
  let occurrence = createBirthdayOccurrence(
    current.getFullYear(),
    birthdate.getMonth(),
    birthdate.getDate()
  );
  if (occurrence.getTime() <= now) {
    occurrence = createBirthdayOccurrence(
      current.getFullYear() + 1,
      birthdate.getMonth(),
      birthdate.getDate()
    );
  }
  return occurrence.getTime();
}

function createBirthdayOccurrence(year: number, month: number, day: number) {
  return createClampedLocalDate(year, month, day, 9);
}

function reminderDueYear(reminder: Reminder) {
  return new Date(reminder.dueAt).getFullYear();
}
