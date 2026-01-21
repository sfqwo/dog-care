import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TabsLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs screenOptions={{ headerTitleAlign: "center" }}>
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
      </Tabs>
    </GestureHandlerRootView>
  );
}
