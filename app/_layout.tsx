import { CareRecordsProvider } from "@/src/hooks/careRecordsContext";
import { ProfileProvider } from "@/src/hooks/profileContext";
import { AuthProvider, useAuthContext } from "@/src/hooks/authContext";
import { BirthdayReminderSync } from "@/src/components/birthdayReminderSync";
import { InformerProvider } from "@/src/components/informer";
import "@/src/setup";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <InformerProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </InformerProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigator() {
  const { session, isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0f766e" />
      </View>
    );
  }

  const navigation = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(session)}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="reset-password" />
      </Stack.Protected>
    </Stack>
  );

  if (!session) return navigation;

  return (
    <ProfileProvider>
      <CareRecordsProvider>
        <BirthdayReminderSync />
        {navigation}
      </CareRecordsProvider>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
});
