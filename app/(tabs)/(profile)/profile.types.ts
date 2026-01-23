import type { Pet } from "@/src/domain/types";

export type PetListItemProps = {
  pet: Pet;
  onRemove: (id: string) => void;
  onEdit: (pet: Pet) => void;
};
