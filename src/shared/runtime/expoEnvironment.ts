import Constants from "expo-constants";
import { Platform } from "react-native";

export function canUseExpoNotifications() {
  return Platform.OS !== "web" && Constants.expoVersion == null;
}
