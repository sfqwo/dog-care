import "@/src/setup";
import { router, Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CARE_PLAN_MENU_ITEMS = [
  {
    id: "today",
    title: "Сегодня",
    subtitle: "План дня",
    icon: "calendar-outline",
  },
  {
    id: "reminders",
    title: "Напоминания",
    subtitle: "Расписание",
    icon: "notifications-outline",
  },
] as const;

type CarePlanMenuId = "today" | "reminders";

function getCarePlanMenuRoute(id: CarePlanMenuId) {
  return id === "today" ? "/today" : "/reminders";
}

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
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
          label={item.title}
          icon={item.icon}
          active={pathname.includes(item.id)}
        />
      )))}
    </View>
  );
}

function HeaderLink({
  id,
  label,
  icon,
  active,
}: {
  id: CarePlanMenuId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
}) {
  return (
    <Pressable
      style={[styles.headerLink, active && styles.headerLinkActive]}
      onPress={() => router.push(getCarePlanMenuRoute(id))}
    >
      <Ionicons
        name={icon}
        size={15}
        color={active ? "#ffffff" : "#0f172a"}
      />
      <Text style={[styles.headerLinkText, active && styles.headerLinkTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRightContainer: {
    paddingRight: 12,
  },
  headerLinks: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  headerLink: {
    minHeight: 32,
    borderRadius: 999,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(15,23,42,0.08)",
  },
  headerLinkActive: {
    backgroundColor: "#0f172a",
  },
  headerLinkText: {
    color: "#0f172a",
    fontSize: 12,
    fontWeight: "700",
  },
  headerLinkTextActive: {
    color: "#ffffff",
  },
});
