import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
} from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import type {
  EmptySlotProps,
  SlotProps,
  SwipeableCardsListContextValue,
  SwipeableCardsListItemBadgeProps,
  SwipeableCardsListItemCheckActionProps,
  SwipeableCardsListItemFooterProps,
  SwipeableCardsListItemHeaderProps,
  SwipeableCardsListItemHelperProps,
  SwipeableCardsListItemNoteProps,
  SwipeableCardsListItemProps,
  SwipeableCardsListItemSubtitleProps,
  SwipeableCardsListItemTitleProps,
  SwipeableCardsListProps,
  SwipeableItemElement,
} from "./types";

const isHeaderElement = (child: ReactNode): child is ReactElement<SlotProps> =>
  isValidElement(child) && child.type === SwipeableCardsListHeader;

const isEmptyElement = (child: ReactNode): child is ReactElement<EmptySlotProps> =>
  isValidElement(child) && child.type === SwipeableCardsListEmpty;

const SwipeableCardsListContext = createContext<SwipeableCardsListContextValue | null>(null);

export function SwipeableCardsList({
  children,
}: SwipeableCardsListProps) {
  let headerContent: ReactNode | undefined;
  let emptyProps: EmptySlotProps | undefined;
  const items: SwipeableItemElement[] = [];

  Children.forEach(children, (child) => {
    if (isHeaderElement(child)) {
      headerContent = child.props.children;
    } else if (isEmptyElement(child)) {
      emptyProps = child.props;
    } else if (isValidElement(child)) {
      items.push(child as ReactElement<any>);
    }
  });

  const contextValue = useMemo<SwipeableCardsListContextValue>(
    () => ({
      isInside: true,
      headerContent,
      emptyProps,
    }),
    [headerContent, emptyProps]
  );

  return (
    <SwipeableCardsListContext.Provider value={contextValue}>
      <FlatList
        data={items}
        keyExtractor={(element, index) =>
          element.key?.toString() ?? element.props.id ?? `item-${index}`
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={SwipeableCardsListHeaderRenderer}
        ListEmptyComponent={SwipeableCardsListEmptyRenderer}
        renderItem={({ item }) => cloneElement(item, item.props)}
      />
    </SwipeableCardsListContext.Provider>
  );
}

export function SwipeableCardsListItem({
  children,
  gradientColors,
  onRemove,
  onPress,
  onLongPress,
  renderRightActions,
}: SwipeableCardsListItemProps) {
  useSwipeableCardsListGuard("SwipeableCardsListItem");
  const gradientArray = [...gradientColors] as [string, string, string];
  const rightActions =
    renderRightActions ??
    (() => (
      <Pressable style={styles.defaultAction} onPress={onRemove}>
        <Text style={styles.defaultActionText}>Удалить</Text>
      </Pressable>
    ));

  return (
    <Swipeable
      friction={2}
      rightThreshold={64}
      overshootRight={false}
      renderRightActions={rightActions}
    >
      <Pressable
        style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressablePressed]}
        onLongPress={onLongPress}
        onPress={onPress}
      >
        <LinearGradient
          colors={gradientArray}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {children}
        </LinearGradient>
      </Pressable>
    </Swipeable>
  );
}

export function SwipeableCardsListItemHeader({
  children,
}: SwipeableCardsListItemHeaderProps) {
  return <View style={styles.cardHeader}>{children}</View>;
}

export function SwipeableCardsListItemTitle({
  text,
}: SwipeableCardsListItemTitleProps) {
  return <Text style={styles.cardTitle}>{text}</Text>;
}

export function SwipeableCardsListItemSubtitle({
  text,
}: SwipeableCardsListItemSubtitleProps) {
  return <Text style={styles.cardSubtitle}>{text}</Text>;
}

export function SwipeableCardsListItemTextBlock({ children }: SlotProps) {
  return <View style={styles.cardTextBlock}>{children}</View>;
}

export function SwipeableCardsListItemBadge({
  text,
  icon = "paw-outline",
}: SwipeableCardsListItemBadgeProps) {
  return (
    <View style={styles.durationPill}>
      <MaterialCommunityIcons name={icon} size={16} style={styles.icon} />
      <Text style={styles.durationValue}>{text}</Text>
    </View>
  );
}

export function SwipeableCardsListItemNote({
  text,
  icon = "notebook-outline",
}: SwipeableCardsListItemNoteProps) {
  if (!text) return null;

  return (
    <View style={styles.noteBox}>
      <MaterialCommunityIcons name={icon} size={18} style={styles.icon} />
      <Text style={styles.noteText}>{text}</Text>
    </View>
  );
}

export function SwipeableCardsListItemFooter({
  children,
}: SwipeableCardsListItemFooterProps) {
  return <View style={styles.cardFooter}>{children}</View>;
}

export function SwipeableCardsListItemHelper({
  text,
  icon,
}: SwipeableCardsListItemHelperProps) {
  if (!text) return null;
  return (
    <View style={styles.helperRow}>
      <MaterialCommunityIcons name={icon} size={16} style={styles.icon} />
      <Text style={styles.helperText}>{text}</Text>
    </View>
  );
}

export function SwipeableCardsListItemCheckAction({
  onPress,
  label = "Отметить",
  checked = false,
  disabled = false,
}: SwipeableCardsListItemCheckActionProps) {
  return (
    <Pressable
      style={[
        styles.checkButton,
        checked && styles.checkButtonChecked,
        disabled && styles.checkButtonDisabled,
      ]}
      onPress={(event) => {
        event.stopPropagation();
        if (disabled) return;
        onPress();
      }}
      disabled={disabled}
    >
      <MaterialCommunityIcons
        name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        size={17}
        style={[
          styles.checkIcon,
          checked && styles.checkIconChecked,
          disabled && styles.checkIconDisabled,
        ]}
      />
      <Text style={[styles.checkButtonText, disabled && styles.checkButtonTextDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function SwipeableCardsListHeader({ children }: SlotProps) {
  useSwipeableCardsListGuard("SwipeableCardsListHeader");
  return <>{children}</>;
}

export function SwipeableCardsListEmpty(_: EmptySlotProps) {
  useSwipeableCardsListGuard("SwipeableCardsListEmpty");
  return null;
}

function useSwipeableCardsListGuard(componentName: string) {
  const context = useContext(SwipeableCardsListContext);
  if (!context?.isInside) {
    console.warn(`[SwipeableCardsList] ${componentName} must be used inside <SwipeableCardsList>.`);
  }
}

function SwipeableCardsListHeaderRenderer() {
  const context = useContext(SwipeableCardsListContext);
  if (!context?.headerContent) return null;
  return <>{context.headerContent}</>;
}

function SwipeableCardsListEmptyRenderer() {
  const context = useContext(SwipeableCardsListContext);
  const emptyProps = context?.emptyProps;
  if (!emptyProps) return null;

  if (emptyProps.children) {
    return <>{emptyProps.children}</>;
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyProps.text}</Text>
    </View>
  );
}
