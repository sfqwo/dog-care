import type { BreedRecord, DogBreedOption } from "./types";

export function mapBreedRecordToOption(record: BreedRecord): DogBreedOption {
  const readableRu = record.name_ru?.trim();
  const readableEn = record.name_en?.trim();
  const title = readableRu && readableRu.length > 1 ? readableRu : readableEn ?? record.code;

  return {
    value: record.code,
    title,
  };
}
