import type { VetHealthInfo } from "@dog-care/domain";
import { EMPTY_HEALTH } from "@/app/(tabs)/(vet)/vet.constants";

export function cloneVetHealth(info?: VetHealthInfo): VetHealthInfo {
  return {
    ...EMPTY_HEALTH,
    ...(info ?? {}),
    vaccines: { ...(info?.vaccines ?? EMPTY_HEALTH.vaccines) },
    optionalVaccines: [...(info?.optionalVaccines ?? EMPTY_HEALTH.optionalVaccines ?? [])],
    deworming: [...(info?.deworming ?? EMPTY_HEALTH.deworming ?? [])],
    ectoparasites: [...(info?.ectoparasites ?? EMPTY_HEALTH.ectoparasites ?? [])],
    allergyEntries: [...(info?.allergyEntries ?? EMPTY_HEALTH.allergyEntries ?? [])],
  };
}
