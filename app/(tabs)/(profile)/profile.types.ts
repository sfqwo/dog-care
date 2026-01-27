import type { Pet } from "@dog-care/types";

export type PetListItemProps = {
  pet: Pet;
  onRemove: (id: string) => void;
  onEdit: (pet: Pet) => void;
};
