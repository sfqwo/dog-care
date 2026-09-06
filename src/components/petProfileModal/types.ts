import type { Pet, PetProfilePayload } from "@dog-care/domain";

export type PetProfileFormState = {
  name: string;
  breed: string;
  species: string;
  gender: string;
  birthdate: string;
  weight: string;
  notes: string;
};

export type PetProfileModalProps = {
  visible: boolean;
  editingPet: Pet | null;
  onAddPet: (pet: PetProfilePayload) => void;
  onUpdatePet: (pet: Pet) => void;
  onClose: () => void;
};
