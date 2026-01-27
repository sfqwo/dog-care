import { useMemo, useCallback } from "react";
import { Tabs } from "@dog-care/tabs";
import { useProfileContext } from "@/src/hooks/profileContext";
import { getSpeciesLabel } from "@dog-care/core/shared";

const DEFAULT_EMPTY_STATE = {
  icon: "paw" as const,
  title: "Нет питомцев",
  subtitle: "Добавьте питомца в профиле, чтобы вести отдельные журналы прогулок.",
};

export function PetTabs() {
  const { profile, selectedPetId, setSelectedPetId } = useProfileContext();

  const petTabItems = useMemo(
    () =>
      profile.pets.map((pet) => {
        const subtitle = (pet.breed?.trim() || getSpeciesLabel(pet.species)) ?? "Питомец";
        const iconName = (pet.species as any) ?? "dog";
        return { id: pet.id, title: pet.name, subtitle, icon: iconName };
      }),
    [profile.pets]
  );

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedPetId(id);
    },
    [setSelectedPetId]
  );

  return (
    <Tabs
      items={petTabItems}
      selectedId={selectedPetId}
      onSelect={handleSelect}
      emptyState={DEFAULT_EMPTY_STATE}
    />
  );
}
