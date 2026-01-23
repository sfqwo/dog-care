import { useMemo } from "react";
import dogBreedsSource from "@dog-care/core/shared/data/dog_ceo_breeds.json";
import catBreedsSource from "@dog-care/core/shared/data/cat_ceo_breeds.json";
import type { BreedRecord, DogBreedOption, SpeciesKey } from "./types";

const BREED_SOURCES: Record<SpeciesKey, BreedRecord[]> = {
  dog: dogBreedsSource.breeds,
  cat: catBreedsSource,
};

export function useDogBreeds(species?: string, query?: string) {
  const normalizedSpecies = (species?.trim().toLowerCase() as SpeciesKey) ?? "dog";
  const normalizedQuery = query?.trim().toLowerCase();

  const sortedBreeds = useMemo(() => {
    const sourceRecords = BREED_SOURCES[normalizedSpecies] ?? BREED_SOURCES.dog;
    const options = sourceRecords.map(mapBreedRecordToOption);
    const filtered = options.filter((option) => {
      if (!normalizedQuery) return true;
      const value = option.title.toLowerCase();
      const code = option.value.toLowerCase();
      return (
        value.includes(normalizedQuery) ||
        code.includes(normalizedQuery)
      );
    });

    return filtered.sort((a, b) => a.title.localeCompare(b.title, "ru"));
  }, [normalizedQuery, normalizedSpecies]);

  return { breeds: sortedBreeds, loading: false, error: null };
}

function mapBreedRecordToOption(record: BreedRecord): DogBreedOption {
  const readableRu = record.name_ru?.trim();
  const readableEn = record.name_en?.trim();
  const title = readableRu && readableRu.length > 1 ? readableRu : readableEn ?? record.code;
  return {
    value: record.code,
    title,
  };
}
