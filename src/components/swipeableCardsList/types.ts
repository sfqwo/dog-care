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
  gradientColors: readonly [string, string, string];
  onRemove: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
  renderRightActions?: () => ReactNode;
  children: ReactNode;
};

export type SwipeableCardsListItemTitleProps = {
  text: string;
};

export type SwipeableCardsListItemSubtitleProps = {
  text: string;
};

export type SwipeableCardsListItemBadgeProps = {
  text: string;
  icon?: IconName;
};

export type SwipeableCardsListItemNoteProps = {
  text?: string;
  icon?: IconName;
};

export type SwipeableCardsListItemHelperProps = {
  text?: string;
  icon?: IconName;
};

export type SwipeableCardsListItemCheckActionProps = {
  onPress: () => void;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
};

export type SwipeableCardsListItemHeaderProps = {
  children: ReactNode;
};

export type SwipeableCardsListItemFooterProps = {
  children: ReactNode;
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
