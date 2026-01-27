import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { TabsProps } from "./types";
import { styles } from "./styles";

function TabsComponent({
  items,
  selectedId,
  onSelect,
  variant = "cards",
  emptyState,
}: TabsProps) {
  if (!items.length) {
    if (!emptyState) return null;

    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconCircle}>
          {emptyState.icon ? (
            <MaterialCommunityIcons name={emptyState.icon} size={22} style={styles.emptyIcon} />
          ) : null}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>{emptyState.title}</Text>
          <Text style={styles.emptySubtitle}>{emptyState.subtitle}</Text>
        </View>
      </View>
    );
  }

  const TabComponent = variant === "segmented" ? TabsSegmented : TabsCards;
  return <TabComponent items={items} selectedId={selectedId} onSelect={onSelect} />;
}

function TabsSegmented({
  items, selectedId, onSelect,
}: TabsProps) {
  return (
    <View style={styles.segmentContainer}>
      {items.map((item, index) => {
        const isActive = item.id === selectedId;
        const isLast = index === items.length - 1;
        return (
          <View key={item.id} style={styles.segmentWrapper}>
            <Pressable
              style={({ pressed }) => [
                styles.segmentButton,
                isActive && styles.segmentButtonActive,
                pressed && styles.segmentButtonPressed,
              ]}
              onPress={() => onSelect(item.id)}
            >
              {item.icon ? (
                <MaterialCommunityIcons
                  name={item.icon}
                  size={16}
                  style={[styles.segmentIcon, isActive && styles.segmentIconActive]}
                />
              ) : null}
              <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                {item.title}
              </Text>
              {item.subtitle ? (
                <Text style={[styles.segmentSubtitle, isActive && styles.segmentTextActive]}>
                  {item.subtitle}
                </Text>
              ) : null}
            </Pressable>
            {!isLast ? <View style={styles.segmentDivider} /> : null}
          </View>
        );
      })}
    </View>
  );
};

function TabsCards({
  items, selectedId, onSelect,
}: TabsProps) {
  return (
    <View style={styles.tabsGrid}>
      {items.map((item) => {
        const isActive = item.id === selectedId;
        const iconName = item.icon ?? "paw";

        return (
          <Pressable
            key={item.id}
            style={({ pressed }) => [
              styles.tabCard,
              isActive && styles.tabCardActive,
              pressed && styles.tabCardPressed,
            ]}
            onPress={() => onSelect(item.id)}
          >
            <View style={styles.tabHeader}>
              <View style={[styles.iconPill, isActive && styles.iconPillActive]}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={18}
                  style={[styles.icon, isActive && styles.iconActive]}
                />
              </View>
              <Text style={[styles.petName, isActive && styles.petNameActive]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
            {item.subtitle ? (
              <Text style={styles.petMeta} numberOfLines={1}>
                {item.subtitle}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

export const Tabs = memo(TabsComponent);
