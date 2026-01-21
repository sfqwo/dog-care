import {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  ComponentProps,
  createContext,
  useContext,
  useMemo,
} from "react";
import { FlatList, Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./styles";

type SwipeableCardsListProps = {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type SwipeableCardsListItemProps = {
  id: string;
  title: string;
  subtitle: string;
  durationText: string;
  gradientColors: readonly [string, string, string];
  onRemove: () => void;
  note?: string;
  helperText?: string;
  renderRightActions?: () => ReactNode;
  durationIcon?: IconName;
  noteIcon?: IconName;
  helperIcon?: IconName;
};

type SlotProps = {
  children: ReactNode;
};

type EmptySlotProps = {
  text?: string;
  children?: ReactNode;
};

const isHeaderElement = (
  child: ReactNode
): child is ReactElement<SlotProps> =>
  isValidElement(child) && child.type === SwipeableCardsListHeader;

const isEmptyElement = (
  child: ReactNode
): child is ReactElement<EmptySlotProps> =>
  isValidElement(child) && child.type === SwipeableCardsListEmpty;

type SwipeableCardsListContextValue = {
  isInside: true;
  headerContent?: ReactNode;
  emptyProps?: EmptySlotProps;
};

const SwipeableCardsListContext = createContext<SwipeableCardsListContextValue | null>(null);

export function SwipeableCardsList({
  children,
}: SwipeableCardsListProps) {
  let headerContent: ReactNode | undefined;
  let emptyProps: EmptySlotProps | undefined;
  const items: ReactElement<any>[] = [];

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
  title,
  subtitle,
  durationText,
  gradientColors,
  note,
  helperText = "Свайп влево или долгое нажатие — удалить",
  onRemove,
  renderRightActions,
  durationIcon = "paw-outline",
  noteIcon = "notebook-outline",
  helperIcon = "gesture-swipe-left",
}: SwipeableCardsListItemProps) {
  useSwipeableCardsListGuard("SwipeableCardsListItem");
  const gradientArray = [...gradientColors] as [string, string, string];
  const rightActions =
    renderRightActions ??
    (() => (
      <Pressable style={styles.defaultAction} onPress={() => onRemove?.()}>
        <Text style={styles.defaultActionText}>Удалить</Text>
      </Pressable>
    ));

  return (
    <Swipeable
      friction={2}
      rightThreshold={64}
      overshootRight={false}
      renderRightActions={rightActions}
      onSwipeableOpen={(direction) => {
        if (direction === "left") {
          onRemove?.();
        }
      }}
    >
      <Pressable
        style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressablePressed]}
        onLongPress={onRemove}
      >
        <LinearGradient
          colors={gradientArray}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.durationPill}>
              <MaterialCommunityIcons name={durationIcon} size={16} style={styles.icon} />
              <Text style={styles.durationValue}>{durationText}</Text>
            </View>
          </View>

          {note ? (
            <View style={styles.noteBox}>
              <MaterialCommunityIcons name={noteIcon} size={18} style={styles.icon} />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ) : null}

          <View style={styles.cardFooter}>
            <MaterialCommunityIcons name={helperIcon} size={16} style={styles.icon} />
            <Text style={styles.helperText}>{helperText}</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Swipeable>
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
