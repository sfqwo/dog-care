import type { UserProfile } from "@dog-care/domain";

export type OwnerProfileCardProps = {
  profile: UserProfile;
  onEdit: () => void;
};

export type InfoLineProps = {
  label: string;
  value?: string | null;
};
