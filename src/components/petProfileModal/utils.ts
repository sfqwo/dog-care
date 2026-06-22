import type { Pet } from "@dog-care/domain";
import { SPECIES_OPTIONS } from "@dog-care/core/shared";
import type { PetProfileFormState } from "./types";

export function buildPetFormDefaults(pet?: Pet | null): PetProfileFormState {
  return {
    name: pet?.name ?? "",
    breed: pet?.breed ?? "",
    species: pet?.species ?? SPECIES_OPTIONS[0].value,
    gender: pet?.gender ?? "",
    birthdate: pet?.birthdate ?? "",
    weight: pet?.weight ?? "",
    notes: pet?.notes ?? "",
  };
}
