import { Pet, PetProfilePayload, UserProfile, UserProfilePayload } from "@/src/domain/types";

export type ProfileContextValue = {
  profile: UserProfile;
  editingPet: Pet | null;
  addPet: (pet: PetProfilePayload) => void;
  updatePet: (pet: Pet) => void;
  removePet: (id: string) => void;
  updateOwner: (profile: UserProfilePayload) => void;
  openEditOwnerModal: () => void;
  openAddPetModal: () => void;
  openEditPetModal: (pet: Pet) => void;
};