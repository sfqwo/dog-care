import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type GenderToggleOption = {
  value: string;
  title: string;
  icon: IconName;
};

export type GenderToggleProps = {
  value?: string;
  options: GenderToggleOption[];
  onChange: (value: string) => void;
};