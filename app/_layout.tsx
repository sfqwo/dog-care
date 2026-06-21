import { CareRecordsProvider } from "@/src/hooks/careRecordsContext";
import { ProfileProvider } from "@/src/hooks/profileContext";
import { BirthdayReminderSync } from "@/src/components";
import "@/src/setup";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ProfileProvider>
          <CareRecordsProvider>
            <BirthdayReminderSync />
            <Stack screenOptions={{ headerShown: false }} />
          </CareRecordsProvider>
        </ProfileProvider>
    </GestureHandlerRootView>
  );
}
