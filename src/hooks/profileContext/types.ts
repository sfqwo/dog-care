import { Pet, PetProfilePayload, UserProfile, UserProfilePayload } from "@dog-care/types";

export type ProfileContextValue = {
  profile: UserProfile;
  editingPet: Pet | null;
  selectedPetId: string | null;
  setSelectedPetId: (id: string | null) => void;
  addPet: (pet: PetProfilePayload) => void;
  updatePet: (pet: Pet) => void;
  removePet: (id: string) => void;
  updateOwner: (profile: UserProfilePayload) => void;
  openEditOwnerModal: () => void;
  openAddPetModal: () => void;
  openEditPetModal: (pet: Pet) => void;
};
