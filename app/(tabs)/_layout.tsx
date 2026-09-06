import "@/src/setup";
import { router, Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getCarePlanMenuRoute, type CarePlanMenuId } from "@/src/screens/tabs/root/utils";
import { colors, radius } from "@/src/theme";

const CARE_PLAN_MENU_ITEMS = [
  {
    id: "today",
    accessibilityLabel: "Сегодня",
    icon: "calendar-outline",
  },
  {
    id: "calendar",
    accessibilityLabel: "Календарь",
    icon: "calendar-number-outline",
  },
  {
    id: "reminders",
    accessibilityLabel: "Напоминания",
    icon: "notifications-outline",
  },
] as const;

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerStyle: styles.header,
          headerTitleAlign: "left",
          headerRight: () => <CarePlanHeaderLinks />,
          headerRightContainerStyle: styles.headerRightContainer,
        }}
      >
        <Tabs.Screen
          name="(walks)/walks"
          options={{
            title: "Прогулки",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="paw" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(feeding)/feeding"
          options={{
            title: "Кормление",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(vet)/vet"
          options={{
            title: "Вет",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="medkit" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(reminders)/reminders"
          options={{
            title: "Напоминания",
            href: null,
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="notifications" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(calendar)/calendar"
          options={{
            title: "Календарь",
            href: null,
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="calendar-number" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(today)/today"
          options={{
            title: "Сегодня",
            href: null,
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)/profile"
          options={{
            title: "Профиль",
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="person-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}

function CarePlanHeaderLinks() {
  const pathname = usePathname();

  return (
    <View style={styles.headerLinks}>
      {CARE_PLAN_MENU_ITEMS.map(((item) => (
        <HeaderLink
          key={item.id}
          id={item.id}
          accessibilityLabel={item.accessibilityLabel}
          icon={item.icon}
          active={pathname.includes(item.id)}
        />
      )))}
    </View>
  );
}

function HeaderLink({
  id,
  accessibilityLabel,
  icon,
  active,
}: {
  id: CarePlanMenuId;
  accessibilityLabel: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.headerLink, active && styles.headerLinkActive]}
      onPress={() => router.push(getCarePlanMenuRoute(id))}
    >
      <Ionicons
        name={icon}
        size={19}
        color={active ? colors.primaryText : colors.text}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 122,
  },
  headerRightContainer: {
    paddingRight: 12,
    paddingVertical: 8,
  },
  headerLinks: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  headerLink: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: colors.secondary,
  },
  headerLinkActive: {
    backgroundColor: colors.primary,
  },
});
