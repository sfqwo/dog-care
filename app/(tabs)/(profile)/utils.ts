import type { Pet } from "@dog-care/domain";

export function buildPetNote(pet: Pet) {
  if (pet.notes?.trim()) {
    return { note: `Заметки: ${pet.notes.trim()}`, noteIcon: "note-edit-outline" as const };
  }
  if (pet.birthdate?.trim()) {
    return { note: `Дата рождения: ${pet.birthdate.trim()}`, noteIcon: "cake-variant" as const };
  }
  return { note: undefined, noteIcon: "account" as const };
}
