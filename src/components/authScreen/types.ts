import type { ReactNode } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type AuthScreenProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  children: ReactNode;
};

export type AuthButtonProps = {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
};

export type AuthLinkProps = {
  children: ReactNode;
  href: "/sign-in" | "/sign-up" | "/forgot-password";
};
