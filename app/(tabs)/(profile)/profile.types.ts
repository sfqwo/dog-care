import type { Pet } from "@dog-care/domain";

export type PetListItemProps = {
  pet: Pet;
  onRemove: (id: string) => void;
  onEdit: (pet: Pet) => void;
};
