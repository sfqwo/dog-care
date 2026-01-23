import type { ComponentProps, ReactElement, ReactNode } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";
import type { StyleProp, ViewStyle } from "react-native";

export type SwipeableCardsListProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type SwipeableCardsListItemProps = {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  gradientColors: readonly [string, string, string];
  onRemove: () => void;
  onPress?: () => void;
  note?: string;
  renderRightActions?: () => ReactNode;
  badgeIcon?: IconName;
  noteIcon?: IconName;
  helperIcon?: IconName;
};

export type SlotProps = {
  children: ReactNode;
};

export type EmptySlotProps = {
  text?: string;
  children?: ReactNode;
};

export type SwipeableCardsListContextValue = {
  isInside: true;
  headerContent?: ReactNode;
  emptyProps?: EmptySlotProps;
};

export type SwipeableItemElement = ReactElement<any>;
