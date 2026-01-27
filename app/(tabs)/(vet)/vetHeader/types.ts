import type { VetRecord } from "@dog-care/types";
import type { VetHealthInfo } from "../vet.types";

export type VetHeaderProps = {
  records: VetRecord[];
  hasPets: boolean;
  healthInfo: VetHealthInfo;
};
