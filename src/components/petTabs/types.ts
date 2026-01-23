import type { Pet } from "@/src/domain/types";

export type PetTabsProps = {
  pets: Pet[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};
