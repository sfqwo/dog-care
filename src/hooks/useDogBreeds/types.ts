export type DogBreedOption = {
  value: string;
  title: string;
};

export type BreedRecord = {
  code: string;
  name_en?: string;
  name_ru?: string;
};

export type SpeciesKey = "dog" | "cat";