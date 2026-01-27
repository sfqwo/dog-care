import { useMemo } from "react";
import type { VetRecord } from "@dog-care/types";
import { formatDateTime } from "@dog-care/core/utils";

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
