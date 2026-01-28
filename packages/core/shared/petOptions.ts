type Option = {
  title: string;
  value: string;
};

export const SPECIES_OPTIONS: Option[] = [
  { title: "Собака", value: "dog" },
  { title: "Кошка", value: "cat" },
];

export const GENDER_OPTIONS: Option[] = [
  { title: "Девочка", value: "female" },
  { title: "Мальчик", value: "male" },
];

const speciesMap = new Map(SPECIES_OPTIONS.map((option) => [option.value, option.title]));
const genderMap = new Map(GENDER_OPTIONS.map((option) => [option.value, option.title]));

export function getSpeciesLabel(value?: string | null) {
  if (!value) return undefined;
  return speciesMap.get(value) ?? value;
}

export function getGenderLabel(value?: string | null) {
  if (!value) return undefined;
  return genderMap.get(value) ?? value;
}
