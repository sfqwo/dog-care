import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type TabItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
};

export type TabsProps = {
  items: TabItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  variant?: "cards" | "segmented";
  emptyState?: {
    icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
    title: string;
    subtitle: string;
  };
};
