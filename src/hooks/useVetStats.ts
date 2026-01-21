import { useMemo } from "react";
import type { VetRecord } from "@/src/domain/types";
import { formatDateTime } from "@/src/ui/format";

export function useVetStats(records: VetRecord[]) {
  return useMemo(() => {
    if (!records.length) {
      return { clinicCount: 0, lastVisitText: "Нет визитов" };
    }

    const clinicNames = records
      .map((record) => record.clinic?.trim())
      .filter((value): value is string => Boolean(value));
    const clinicCount = new Set(clinicNames).size;
    const lastVisitText = formatDateTime(records[0].at);

    return { clinicCount, lastVisitText };
  }, [records]);
}
