import type { UserProfile } from "@dog-care/domain";
import type { OwnerFormValues } from "./types";

export function mapProfileToForm(profile: UserProfile): OwnerFormValues {
  return {
    ownerName: profile.ownerName ?? "",
    email: profile.email ?? "",
    birthdate: profile.birthdate ?? "",
    phone: profile.phone ?? "",
  };
}
