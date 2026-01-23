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

export const WEIGHT_OPTIONS: Option[] = (() => {
  const values: Option[] = [];
  const seeds = [1, 1.5, 2];
  seeds.forEach((seed) => values.push({ title: `${seed} кг`, value: seed.toString() }));
  for (let kg = 3; kg <= 80; kg += 1) {
    values.push({ title: `${kg} кг`, value: kg.toString() });
  }
  return values;
})();

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
