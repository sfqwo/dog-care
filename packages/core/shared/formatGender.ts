import { getGenderLabel } from "./petOptions";

export function formatGender(value?: string) {
  return getGenderLabel(value);
}
