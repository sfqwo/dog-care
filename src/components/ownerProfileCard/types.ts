import type { UserProfile } from "@/src/domain/types";

export type OwnerProfileCardProps = {
  profile: UserProfile;
  onEdit: () => void;
};

export type InfoLineProps = {
  label: string;
  value?: string | null;
};
