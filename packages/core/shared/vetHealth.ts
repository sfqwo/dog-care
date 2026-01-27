import type { VetRecord } from "@dog-care/types";
import { formatDateTime } from "../utils";

export type VetRecordSummary = Pick<VetRecord, "at" | "title" | "note" | "clinic">;

export type VaccineSectionSummary<T extends string = string> = {
  key: T;
  description: string;
  keywords: RegExp[];
};

export type VaccineEntrySummary = {
  date?: string;
  vaccineName?: string;
  manufacturer?: string;
  batchNumber?: string;
  validUntil?: string;
  clinic?: string;
  reactionNotes?: string;
};

export type AllergyEntrySummary = {
  trigger?: string;
  reaction?: string;
  notes?: string;
};

export type VetManualHealth<T extends string = string> = {
  vaccines?: Partial<Record<T, VaccineEntrySummary[]>>;
  allergyEntries?: AllergyEntrySummary[];
};

export type SummaryResult = {
  label: string;
  subtitle: string;
};

export function getVaccineSummary<T extends string>(
  section: VaccineSectionSummary<T>,
  records: VetRecordSummary[],
  manual: VetManualHealth<T>
): SummaryResult {
  const entry = getLatestManualEntry(manual.vaccines?.[section.key]);
  if (entry?.date?.trim()) {
    const subtitleParts = [
      entry.vaccineName?.trim(),
      entry.manufacturer?.trim(),
      entry.batchNumber?.trim() ? `Серия ${entry.batchNumber.trim()}` : undefined,
      buildValidityLabel(entry.validUntil),
      entry.clinic?.trim(),
      entry.reactionNotes?.trim(),
    ].filter(Boolean);
    return {
      label: entry.date.trim(),
      subtitle: subtitleParts.join(" • ") || section.description,
    };
  }

  const match = findMatchingRecord(records, section.keywords);
  if (!match) {
    return {
      label: "Нет данных",
      subtitle: `Добавьте запись: ${section.description}`,
    };
  }
  const subtitle = match.note?.trim() || match.clinic?.trim() || section.description;
  return {
    label: formatDateTime(match.at),
    subtitle,
  };
}

export function getAllergySummary(
  records: VetRecordSummary[],
  manual: VetManualHealth
): SummaryResult {
  const firstEntry = manual.allergyEntries?.find(
    (entry) =>
      Boolean(entry?.trigger?.trim()) ||
      Boolean(entry?.reaction?.trim()) ||
      Boolean(entry?.notes?.trim())
  );
  if (firstEntry) {
    const label = firstEntry.trigger?.trim() || "Запись сохранена";
    const subtitle =
      firstEntry.reaction?.trim() ||
      firstEntry.notes?.trim() ||
      "Откройте карточку, чтобы увидеть детали";
    return { label, subtitle };
  }

  const allergyRecord = findMatchingRecord(records, [/аллер/i]);
  if (!allergyRecord) {
    return {
      label: "Не обнаружено",
      subtitle: "Добавьте примечание при необходимости",
    };
  }
  return {
    label: allergyRecord.title,
    subtitle: allergyRecord.note?.trim() || "Без подробностей",
  };
}

function findMatchingRecord(records: VetRecordSummary[], patterns: RegExp[]) {
  return records.find((record) => {
    const haystack = `${record.title} ${record.note ?? ""}`;
    return patterns.some((regex) => regex.test(haystack));
  });
}

function buildValidityLabel(validUntil?: string) {
  if (!validUntil?.trim()) return undefined;
  return `Действительна до ${validUntil.trim()}`;
}

function getLatestManualEntry(list?: VaccineEntrySummary[]) {
  if (!list?.length) return undefined;
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const entry = list[index];
    if (!entry) continue;
    const hasDetails = Object.values(entry).some((value) => {
      if (typeof value !== "string") return Boolean(value);
      return value.trim().length > 0;
    });
    if (hasDetails) {
      return entry;
    }
  }
  return undefined;
}
